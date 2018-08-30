import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames/bind';
import CheckBox from 'fusion-core-components/lib/components/CheckBox/CheckBox';
import { connect } from 'react-redux';
import Button from 'fusion-core-components/lib/components/Button/Button';
import _findIndex from 'lodash/findIndex';
import _values from 'lodash/values';
import { bindActionCreators } from 'redux';
import { messagesActions } from 'yoda-fusion-site-components/lib/components/Messages';
import * as searchFilterActions from '../../actions/SearchFilterAction';
import * as caseSearchActions from '../../actions/CaseSearchAction';
import styles from './SearchFilter.css';

const cx = classNames.bind(styles);

export class SearchFilter extends Component {

    static defaultProps = {
        toggleFilterBox: [],
        actions: null,
        inputData: [],
        caseFilter: {},
        selectedFilter: {},
    }

    static propTypes = {
        actions: PropTypes.objectOf(PropTypes.func),
        toggleFilterBox: PropTypes.func,
        inputData: PropTypes.objectOf(PropTypes.func),
        caseFilter: PropTypes.Object,
        selectedFilter: PropTypes.Object,

    }

    constructor() {
        super();
        this.state = {
            filters: [],
        };
    }
    componentWillMount() {
        const { selectedFilter } = this.props;
        this.setState({
            filters: [...selectedFilter],
        });
        const inputFields = this.props.inputData;
        const sDate = inputFields.startDate ? inputFields.startDate.format() : '';
        const eDate = inputFields.endDate ? inputFields.endDate.format() : '';
        const startDate = new Date(sDate);
        const startMS = startDate.getTime();
        const endDate = new Date(eDate);
        const endMS = endDate.getTime();
        const payload = {
            start: startMS,
            end: endMS,
        };
        payload[inputFields.searchType] = inputFields.searchText;
        this.props.actions.getFilterItemsRequest(payload);
        document.addEventListener('click', this.handleClick, false);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false);
    }
    handleClick = (e) => {
        if (!this.node.contains(e.target)) {
            this.props.toggleFilterBox();
        }
    }
    filterSubmit = () => {
        const filterValues = this.state.filters;
        this.props.actions.maintainFilterItemRequest(this.state.filters);
        const priority = [];
        const status = [];
        const type = [];
        const casePriority = filterValues.map((item) => {
            if (item.resource === 'priority') {
                priority.push(item.id);
            } else if (item.resource === 'status') {
                status.push(item.id);
            } else if (item.resource === 'type') {
                type.push(item.id);
            }
            return casePriority;
        });
        const inputFields = this.props.inputData;
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
        this.props.toggleFilterBox();
    }
    showValue = (e, value, id, flag) => {
        const selectedStatus = e;
        const selectedId = id;
        const selectedName = value;
        const addFilterItem = { name: selectedName, id: selectedId, resource: flag };

        if (selectedStatus === true) {
            const filterArray = this.state.filters;
            filterArray.push(addFilterItem);
            this.setState({
                filters: filterArray,
            });
        } else if (selectedStatus === false) {
            const removeFilterItem = { name: selectedName, id: selectedId, resource: flag };
            const filter = this.state.filters;
            const removeElement = _findIndex(filter, removeFilterItem);
            filter.splice(removeElement, 1);
            this.setState({ filters: filter });
        }
    }
    render() {
        const { caseFilter, selectedFilter } = this.props;
        const filterArr = _values(selectedFilter);
        const statusFilter = caseFilter && caseFilter.statusList && caseFilter.statusList.map((item) => {
            const checkBoxStatus = [];
            const statusCount = item.count ? item.count : '0';
            const indexVal = _findIndex(filterArr, { name: item.name });
            let checkStatus = true;
            if (indexVal === -1) {
                checkStatus = false;
            }
            checkBoxStatus.push(<div>
                <CheckBox className={cx('filterCheckbox')} data-automation-id="status-checkbox" config={{ defaultChecked: checkStatus, id: `status_${item.id}`, name: item.name }} label={<span className={cx('filterLabel')}>{item.name} ({statusCount})</span>} onClick={e => this.showValue(e.target.checked, item.name, item.id, 'status')}/>
            </div>);
            return checkBoxStatus;
        });
        const priorityFilter = caseFilter && caseFilter.priorityList && caseFilter.priorityList.map((item) => {
            const checkBoxPriority = [];
            const priorityCount = item.count ? item.count : '0';
            const indexVal = _findIndex(filterArr, { name: item.name });
            let checkStatus = true;
            if (indexVal === -1) {
                checkStatus = false;
            }
            checkBoxPriority.push(<div>
                <CheckBox className={cx('filterCheckbox')} data-automation-id="priority-checkbox" config={{ defaultChecked: checkStatus, id: `pri_${item.id}`, name: item.name }} label={<span className={cx('filterLabel')}>{item.name} ({priorityCount})</span>} onClick={e => this.showValue(e.target.checked, item.name, item.id, 'priority')} />
            </div>);
            return checkBoxPriority;
        });
        const typeFilter = caseFilter && caseFilter.caseTypeList && caseFilter.caseTypeList.map((item) => {
            const checkBoxType = [];
            const typeCount = item.count ? item.count : '0';
            const indexVal = _findIndex(filterArr, { name: item.name });
            let checkStatus = true;
            if (indexVal === -1) {
                checkStatus = false;
            }
            checkBoxType.push(<div>
                <CheckBox className={cx('filterCheckbox')} data-automation-id="priority-checkbox" config={{ defaultChecked: checkStatus, id: `type_${item.id}`, name: item.name }} label={<span className={cx('filterLabel')}>{item.name} ({typeCount})</span>} onClick={e => this.showValue(e.target.checked, item.name, item.id, 'type')} checked="checked" />
            </div>);
            return checkBoxType;
        });
        return (
            <div ref={(node) => { this.node = node; }}>
                <div className={cx('filterContent')}>
                    <div data-automation-id="filter-by-type" className={cx('checkBoxText', 'accordianCheckbox', 'filterByType')}>
                        <h1>By Type</h1>
                        {typeFilter}
                    </div>
                    <div data-automation-id="filter-by-status" className={cx('checkBoxText', 'accordianCheckbox', 'filterByStatus')}>
                        <h1>By Status</h1>
                        {statusFilter}
                    </div>
                    <div data-automation-id="filter-by-priority" className={cx('checkBoxText', 'accordianCheckbox', 'filterByPriority')}>
                        <h1>By Priority</h1>
                        {priorityFilter}
                    </div>
                    <div className={cx('filterButtons')}>
                        <Button data-automation-id="apply-filter-btn" buttonType="Tertiary" type="button" size="xl" className={cx('applyFilterBtn')} onClick={this.filterSubmit}>Apply Filter</Button>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = store => ({
    caseFilter: store.filterResults.filterResults,
    selectedFilter: store.filterResults.selectedFilterResults ? store.filterResults.selectedFilterResults : [],
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign(messagesActions, searchFilterActions, caseSearchActions), dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilter);
