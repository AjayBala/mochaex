import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import classNames from 'classnames/bind';
import Icon from 'fusion-core-components/lib/components/Icon/Icon';
import Button from 'fusion-core-components/lib/components/Button/Button';
import Input from 'fusion-core-components/lib/components/Input/Input';
import { connect } from 'react-redux';
import _findIndex from 'lodash/findIndex';
import _values from 'lodash/values';
import _map from 'lodash/map';
import _omit from 'lodash/omit';
import _set from 'lodash/set';
import _get from 'lodash/get';
import { bindActionCreators } from 'redux';
import { messagesActions } from 'yoda-fusion-site-components/lib/components/Messages';
import Loader from 'fusion-core-components/lib/components/Loader/Loader';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import TablePanel from 'fusion-site-components/lib/components/TablePanel/TablePanel';
import * as caseSearchActions from '../../actions/CaseSearchAction';
import * as searchFilterActions from '../../actions/SearchFilterAction';
import styles from './CaseSearch.css';
import CaseColumn from '../../common/CaseColumn';
import SearchFilter from '../SearchFilter/SearchFilter';
import { validateSearchType, isValidRange } from '../../common/Util';
import IconCalendar from './IconCalendar';

let updatedCaseColumn = [];
let caseColumnModified = [];
const cx = classNames.bind(styles);
export class CaseSearch extends Component {


    static defaultProps = {
        caseList: {},
        actions: null,
        selectedFilter: {},
        maxThreshold: null,
    }

    static propTypes = {
        actions: PropTypes.objectOf(PropTypes.func),
        caseList: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.array]),
        selectedFilter: PropTypes.Object,
        maxThreshold: PropTypes.number,
    }

    constructor() {
        super();
        this.state = {
            searchText: '',
            startDate: moment().add(-30, 'days'),
            endDate: moment(),
            searchType: '',
            isLoading: false,
            emptySearch: false,
            dateInvalid: false,
            startDateInvalid: false,
            endDateInvalid: false,
            expanded: null,
            sortColId: '',
            sortOrd: '',
            hasError: false,
        };
    }

    onChange = (value) => {
        this.setState({
            searchText: value,
        });
    };

    onReset = () => {
        this.setState({ searchText: '' });
    };
    onKeyChangeHandler = (event) => {
        const code = event.which || event.keyCode;
        if (code === 13) {
            this.searchHandler();
        }
    }
    getUpdatedCaseColumn = () => {
        const ret = CaseColumn;
        ret[0].template = obj => (<Link to={`/case/${obj.dataSource}`} activeClassName="active">{obj.dataSource}</Link>);
        ret[2].template = cDate => (<span>{_get(cDate, 'row.createdDate', '')}</span>);
        ret[5].template = params => (<div> <span className={params.dataSource === 'High' ? cx('priorityHigh') : ''}>{params.dataSource}</span></div>);
        ret[7].template = rDate => (<span>{_get(rDate, 'row.releaseDate', '')}</span>);
        return ret;
    }
    generateColumns = (caseColumns, sortBy, sortOrder) => {
        const selectedCol = sortBy;
        const colOrder = sortOrder;
        caseColumnModified = _map(caseColumns, o => _omit(o, 'sortOrder'));
        const index = _findIndex(caseColumnModified, o => o.id === selectedCol);
        _set(caseColumnModified[index], 'sortOrder', colOrder);
        return caseColumnModified;
    }

    triggerSort = (colId, colOrder) => {
        this.setState({ sortColId: colId, sortOrd: colOrder });
        const searchKeyword = validateSearchType(this.state.searchText);
        const sDate = this.state.startDate.format();
        const eDate = this.state.endDate.format();
        const sortPayload = this.searchCommonParams(sDate, eDate, searchKeyword);
        const caseColumnLink = this.getUpdatedCaseColumn();
        sortPayload.sortField = colId;
        sortPayload.sortOrder = colOrder;
        this.props.actions.getcaseSearchListing(sortPayload);
        this.setState({ emptySearch: false });
        updatedCaseColumn = this.generateColumns(caseColumnLink, colId, colOrder);
    }
    searchHandler = (pageNumber) => {
        const validateObj = {
            hasError: false,
            startDateInvalid: false,
            emptySearch: false,
            dateInvalid: false,
            endDateInvalid: false,
        };
        if (this.state.startDate === null) {
            validateObj.startDateInvalid = true;
        } else if (this.state.endDate === null) {
            validateObj.endDateInvalid = true;
        } else if (this.state.searchText.length >= 3) {
            const searchKeyword = validateSearchType(this.state.searchText);
            this.setState({ searchType: searchKeyword });
            const sDate = this.state.startDate.format();
            const eDate = this.state.endDate.format();
            const validDate = isValidRange(sDate, eDate);
            const payload = this.searchCommonParams(sDate, eDate, searchKeyword);
            payload.pageNumber = isNaN(pageNumber) ? 1 : pageNumber;
            const isInitSearch = isNaN(pageNumber);
            if (this.state.sortColId && this.state.sortOrd) {
                payload.sortField = this.state.sortColId;
                payload.sortOrder = this.state.sortOrd;
            }
            if (validDate) {
                this.props.actions.getcaseSearchListing(payload, isInitSearch);
                this.props.actions.maintainFilterItemRequest([]);
            } else {
                validateObj.dateInvalid = true;
            }
        } else if (this.state.searchText.length > 0 && this.state.searchText.length < 3) {
            validateObj.hasError = true;
        } else {
            validateObj.emptySearch = true;
        }
        this.setState(validateObj);
        if (validateObj.emptySearch) {
            this.props.actions.caseSearchEmptyRequest();
        }
    }
    searchCommonParams = (sDate, eDate, searchKeyword) => {
        if (searchKeyword === 'case.caseId') {
            const payload = {};
            payload[searchKeyword] = this.state.searchText;
            return payload;
        }
        const startDate = new Date(sDate);
        const startMS = startDate.getTime();
        const endDate = new Date(eDate);
        const endMS = endDate.getTime();
        const payload = {
            start: startMS,
            end: endMS,
        };
        if (searchKeyword === 'contacts.phone') {
            payload[searchKeyword] = this.state.searchText.replace(/-|\s/g, '');
        } else {
            payload[searchKeyword] = this.state.searchText;
        }
        return payload;
    }

    toggleFilterBox = () => {
        this.setState({
            expanded: !this.state.expanded,
        });
    }

    backSearch = () => {
        if (this.state.searchText === '') {
            browserHistory.goBack();
        } else {
            this.props.actions.caseSearchEmptyRequest();
            this.onReset();
        }
    }
    handleChangeEnd = (date) => {
        this.setState({
            endDate: date,
        });
    }
    handleChangeStart = (date) => {
        this.setState({
            startDate: date,
        });
    }
    removeFilter = (item) => {
        const removeFilterItem = { name: item.name, id: item.id, resource: item.resource };
        const filter = this.props.selectedFilter;
        const index = _findIndex(filter, removeFilterItem);
        filter.splice(index, 1);
        this.props.actions.maintainFilterItemRequest(filter);
        const priority = [];
        const status = [];
        const type = [];
        const casePriority = filter.map((itemVal) => {
            if (itemVal.resource === 'priority') {
                priority.push(itemVal.id);
            } else if (itemVal.resource === 'status') {
                status.push(itemVal.id);
            } else if (itemVal.resource === 'type') {
                type.push(itemVal.id);
            }
            return casePriority;
        });
        const inputFields = this.state;
        const sDate = inputFields.startDate.format();
        const eDate = inputFields.endDate.format();
        const startDate = new Date(sDate);
        const startMS = startDate.getTime();
        const endDate = new Date(eDate);
        const endMS = endDate.getTime();
        const payload = {
            start: startMS,
            end: endMS,
        };
        payload[inputFields.searchType] = inputFields.searchText;
        if (priority.length > 0) {
            payload.priority = priority.join(':').toString();
        }
        if (type.length > 0) {
            payload['department.caseType'] = type.join(':').toString();
        }
        if (status.length > 0) {
            payload['status.value'] = status.join(':').toString();
        }
        this.props.actions.getcaseSearchListing(payload);
    }
    renderResetIcon = () => {
        if (this.state.searchText.length > 0) {
            return (
                <span className={cx('close')}>
                    <button
                        id="TypeaheadInputCloseBtn" className={styles.closeIcon} onClick={this.onReset}
                        type="button">
                        <Icon iconType="svg" width="40" height="40" viewBox="0 0 32 32" name={'closecircle'} className={cx('closeCircle')} />
                    </button>
                </span>
            );
        }
        return '';
    }
    renderFilterItems = () => {
        const { selectedFilter } = this.props;
        const filterArr = _values(selectedFilter);
        const renderItems = filterArr && filterArr.map((item) => {
            const filterload = [];
            filterload.push(<button className={cx('filterLabel')} >
                <span className={cx('lableText')}>{item.name}</span>
                <span className={cx('lableClose')}>
                    <a id="closeFunction" href="javascript:void(0);" onClick={() => this.removeFilter(item)}>
                        <Icon iconType="svg" classNames="icon" viewBox="0 0 24 24" width="32px" height="32px" automationId="collapse-right" name="close" pathClassName={cx('rightIcon')} />
                    </a>
                </span>
            </button>);
            return filterload;
        });
        return renderItems;
    }

    render() {
        const { caseList, selectedFilter, maxThreshold } = this.props;
        const { expanded } = this.state;
        const { cases, count: caseCount } = caseList;
        const enableExternalSort = caseCount > 0 && caseCount > maxThreshold;
        const caseColumnWithLink = this.getUpdatedCaseColumn();
        return (

            <div className={cx('myCase')}>
                <div className={cx('searchResultHeader')}>
                    {this.state.isLoading ? <Loader
                        keepOverlay
                        automationId="test-automation-loader-1"
                        loaderClass={styles.loaderClass} /> : ''}
                    <div className={cx('xl6', 'lg6', 'md6', 'sm6')}>
                        <div className={cx('backArrow')}>
                            <button onClick={this.backSearch}>
                                <Icon iconType="svg" classNames="icon" viewBox="0 0 32 32" width="32px" height="32px" automationId="collapse-right" name="arrow" pathClassName={cx('iconColor')} className={cx('backIcon')} />
                            </button>
                        </div>
                        <div className={cx('group')}>
                            <label htmlFor="label1" />
                            <Input
                                id="caseSearch"
                                theme={styles.searchResultInput}
                                onChange={this.onChange}
                                value={this.state.searchText || ''}
                                name="caseSearch"
                                type="text"
                                placeholder="Search by Case ID, Email or Phone"
                                onKeyPress={this.onKeyChangeHandler}
                            />
                            {this.renderResetIcon()}
                        </div>
                        {(this.state.hasError) ?
                            <div className={cx('error', 'searchErrorPosition')}>
                                Minimum 3 characters required to search
                            </div> : ''}
                        {(this.state.emptySearch) ?
                            <div className={cx('error', 'searchErrorPosition')}>
                                Enter Case ID, Email or Phone.
                            </div> : ''}
                    </div>

                    <div className={cx('xl6', 'lg6', 'md6', 'sm6', 'dateRangeWrapper')}>
                        <div className={cx('dateRangeContain')}>
                            <div className={cx('dategroup')}>
                                <div className={cx('dateLabel')} data-automation-id="start-date-label">Start date</div>
                                <div className={cx('datePicker')}>
                                    <DatePicker
                                        selected={this.state.startDate}
                                        data-automation-id="start-date-picker"
                                        popoverAttachment="bottom right"
                                        popoverTargetAttachment="top right"
                                        onChange={this.handleChangeStart}
                                        placeholderText="01/12/2017"
                                        className={cx('startdatePicker')}
                                        maxDate={moment()}
                                        dateFormat={['MM/DD/YY']}
                                        popperClassName={cx('popperPosition')}
                                    />
                                    <span className={cx('dateIcon')}>
                                        <DatePicker
                                            customInput={<IconCalendar />}
                                            selected={this.state.startDate}
                                            popoverAttachment="bottom right"
                                            popoverTargetAttachment="top right"
                                            onChange={this.handleChangeStart}
                                            placeholderText="01/12/2017"
                                            className={cx('startdatePicker')}
                                            maxDate={moment()}
                                            dateFormat={['MM/DD/YY']}
                                            data-automation-id="start-date"
                                            popperClassName={cx('popperPositionIcon')}
                                        />
                                    </span>
                                </div>
                            </div>

                            <div className={cx('dategroup')}>
                                <div className={cx('dateLabel')} data-automation-id="end-date-label">End date</div>
                                <div className={cx('datePicker')}>
                                    <DatePicker
                                        selected={this.state.endDate}
                                        data-automation-id="end-date-picker"
                                        popoverAttachment="bottom right"
                                        popoverTargetAttachment="top right"
                                        onChange={this.handleChangeEnd}
                                        placeholderText="01/12/2017"
                                        className={cx('startdatePicker')}
                                        maxDate={moment()}
                                        dateFormat={['MM/DD/YY']}
                                        popperClassName={cx('popperPosition')}
                                    />
                                    <span className={cx('dateIcon')}>
                                        <DatePicker
                                            customInput={<IconCalendar />}
                                            selected={this.state.endDate}
                                            popoverAttachment="bottom right"
                                            popoverTargetAttachment="top right"
                                            onChange={this.handleChangeEnd}
                                            placeholderText="01/12/2017"
                                            className={cx('startdatePicker')}
                                            maxDate={moment()}
                                            dateFormat={['MM/DD/YY']}
                                            data-automation-id="end-date"
                                            popperClassName={cx('popperPositionIcon')}
                                        />
                                    </span>
                                </div>
                            </div>
                            <Button data-automation-id="search-button" buttonType="Tertiary" type="button" size="Xl" className={cx('applyBtn')} onClick={this.searchHandler}>Search</Button>
                            {(this.state.dateInvalid) ?
                                <div className={cx('error')}>
                                    Start date or end date is not valid
                                </div> : ''}
                            {(this.state.startDateInvalid) ?
                                <div className={cx('error')}>
                                    Start date is Mandatory
                            </div> : ''}
                            {(this.state.endDateInvalid) ?
                                <div className={cx('error')}>
                                    End date is Mandatory
                            </div> : ''}
                        </div>
                    </div>
                </div>
                {(caseCount > 0) ?
                    <div className={cx('myCaseBody')}>
                        <div className={cx('titleContainer')}>
                            <div className={cx('title', 'xl11', 'lg11', 'md11', 'sm6')}>
                                <span className={cx('caseCount')}>{caseCount} Cases</span>
                                {this.renderFilterItems()}
                                {
                                    selectedFilter.length >= 2 ?
                                        <div className={cx('clearFilter')}>
                                            <a href="javascript:void(0);" onClick={this.searchHandler}>Clear Filter</a>
                                        </div> : null
                                }
                            </div>
                            <div className={cx('filterTxt', 'xl1', 'lg1', 'md1', 'sm6')}>
                                <a href="javascript:void(0);" onClick={this.toggleFilterBox}>Filter</a>
                                {expanded ?
                                    <SearchFilter toggleFilterBox={this.toggleFilterBox} inputData={this.state} />
                                    : null}
                            </div>
                        </div>
                        <TablePanel
                            rowData={cases}
                            colData={(updatedCaseColumn.length) === 0 ?
                                caseColumnWithLink : updatedCaseColumn}
                            showPagination
                            enableExternalSort={enableExternalSort}
                            handleExternalSort={enableExternalSort && this.triggerSort}
                            totalRecords={caseCount}
                            getNewPage={this.searchHandler}
                            maxThreshold={maxThreshold}
                            dropContent={cx('paginationDropdown')}
                            theme={cx('tablePanelSearchContainer')}
                        />
                    </div> : ''}
                {(caseCount === null && (!this.state.emptySearch) && (!this.state.dateInvalid)
                    && (!this.state.startDateInvalid) && (!this.state.endDateInvalid)) ?
                        <div className={cx('noResultFound')}>
                            <h1>No Results Found.</h1>
                        </div> : ''}
            </div>
        );
    }
}

const mapStateToProps = store => ({
    caseList: store.casesearchResults.searchNewResponse,
    filterCase: store.filterResults,
    selectedFilter: store.filterResults ? store.filterResults.selectedFilterResults : [],
    maxThreshold: _get(store.context, 'preferences.tablePanelMaxThreshold', 0),
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign(messagesActions, caseSearchActions, searchFilterActions), dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CaseSearch);
