import classNames from 'classnames/bind';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import _map from 'lodash/map';
import _omit from 'lodash/omit';
import _findIndex from 'lodash/findIndex';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import { messagesActions } from 'yoda-fusion-site-components/lib/components/Messages';
import Loader from 'fusion-core-components/lib/components/Loader/Loader';
import coreSprite from 'fusion-core-components/lib/assets/sprite.svg';
import siteSprite from 'yoda-fusion-site-components/lib/assets/sprite.svg';
import LoadSVG from 'fusion-core-components/lib/helpers/LoadSVG/LoadSVG';
import TablePanel from 'fusion-site-components/lib/components/TablePanel/TablePanel';
import * as caseItemActions from '../../actions/CaseItemsAction';
import * as caseSearchActions from '../../actions/CaseSearchAction';
import * as caseFilterActions from '../../actions/CaseFilterActions';
import * as NotificationsAction from '../../actions/NotificationsAction';
import * as CaseDetailsActions from '../../actions/CaseDetailsAction';
import * as LoaderAction from '../../../node_modules/yoda-fusion-site-components/lib/actions/LoadingAction';
import styles from './CaseItems.css';
import CaseHeader from '../CaseHeader/CaseHeader';
import CaseColumn from '../../common/CaseColumn';
import Filter from '../Filter/Filter';

let updatedCaseColumn = [];
let caseColumnModified = [];

const cx = classNames.bind(styles);

export class CaseItems extends Component {

    static defaultProps = {
        caseList: {},
        actions: null,
        notifications: {},
        caseRequest: {},
        filterOptions: {},
        maxThreshold: null,
        preferences: {},
        isLoading: '',
    }

    static propTypes = {
        actions: PropTypes.objectOf(PropTypes.func),
        caseList: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.array]),
        notifications: PropTypes.objectOf(PropTypes.Object),
        caseRequest: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.array]),
        filterOptions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        maxThreshold: PropTypes.number,
        preferences: PropTypes.objectOf(PropTypes.object),
        isLoading: PropTypes.bool,
    }

    constructor() {
        super();
        this.state = {
            selectedTab: 'myCases',
            previousDept: '',
            sortField: '',
            sortOrder: '',
        };
    }

    componentWillMount() {
        this.getListing();
        this.props.actions.getConfigOptions();
        this.getFilterOptions();
    }
    getListing = (payload = {}) => {
        const { preferences } = this.props;
        const { agentId } = preferences;

        payload['agent.id'] = agentId;
        payload.pageNumber = 1;
        this.props.actions.getcaseListing(payload);
    }
    getFilterOptions = (payload = {}) => {
        const { preferences } = this.props;
        const { agentId } = preferences;
        payload['agent.id'] = agentId;
        this.props.actions.getFilterItemsRequest(payload);
    }
    getUpdatedCaseColumn = () => {
        const ret = CaseColumn;
        ret[0].template = obj => (<Link to={`/case/${obj.dataSource}`} activeClassName="active">{obj.dataSource}</Link>);
        ret[4].template = params => (<div> <span className={params.dataSource === 'High' ? cx('priorityHigh') : ''}>{params.dataSource}</span></div>);
        return ret;
    }

    getNewPage = (pageNumber) => {
        const payload = {
            'agent.id': _get(this.props.preferences, 'agentId'),
            pageNumber,
        };
        if (this.state.sortField) {
            payload.sortField = this.state.sortField;
        }
        if (this.state.sortOrder) {
            payload.sortOrder = this.state.sortOrder;
        }
        this.props.actions.getcaseListing(payload);
    }

    refreshSearch = () => {
        const selectedItems = {
            quickFilter: { department: 'All Departments', SelectedBrick: 'none' },
            advanceFilter: [],
        };
        this.props.actions.showLoader();
        this.props.actions.maintainFilterItemRequest(selectedItems);
        this.applyFilter(selectedItems);
    }

    sortCallback = (colId, colOrder) => {
        const { preferences } = this.props;
        const { agentId } = preferences;
        const sortPayload = {
            sortField: colId,
            sortOrder: colOrder,
            'agent.id': agentId,
            pageNumber: 1,
        };
        this.props.actions.getcaseListing(sortPayload);
        this.setState({ emptySearch: false, sortField: colId, sortOrder: colOrder });
        const caseColumnLink = this.getUpdatedCaseColumn();
        updatedCaseColumn = this.generateColumns(caseColumnLink, colId, colOrder);
    }
    backToSearch = () => {
        browserHistory.push('/case/search');
    }
    generateColumns = (CaseColumns, sortBy, sortOrder) => {
        const selectedCol = sortBy;
        const colOrder = sortOrder;
        caseColumnModified = _map(CaseColumns, o => _omit(o, 'sortOrder'));
        const index = _findIndex(caseColumnModified, o => o.id === selectedCol);
        _set(caseColumnModified[index], 'sortOrder', colOrder);
        return caseColumnModified;
    }

    // Switching tabs between - My Cases, Department Cases, Dashboard
    switchTab = (tab) => {
        this.setState({
            selectedTab: tab,
        });
    }

    applyFilter = (selectedOptions) => {
        const { quickFilterCaseCount } = _get(this.props, 'caseList');
        this.props.actions.showLoader();
        this.props.actions.maintainFilterItemRequest(selectedOptions);
        const payload = {};
        // to update advanceFilter
        if (selectedOptions.advanceFilter) {
            const priority = [];
            const status = [];
            const type = [];

            const casePriority = selectedOptions.advanceFilter.map((item) => {
                if (item.resource === 'priority') {
                    priority.push(item.id);
                } else if (item.resource === 'status') {
                    status.push(item.id);
                } else if (item.resource === 'type') {
                    type.push(item.id);
                }
                return casePriority;
            });

            const startMS = new Date().getTime();
            const endMS = new Date().getTime();
            payload.fromDate = startMS;
            payload.toDate = endMS;

            if (priority.length) {
                payload.priority = priority.join(':').toString();
            }
            if (type.length) {
                payload['department.caseType'] = type.join(':').toString();
            }
            if (status.length) {
                payload['status.value'] = status.join(':').toString();
            }
        }

        // to update quick filter
        const dept = _get(this.props.caseRequest, 'departmentList', false);
        if (dept && !_isEmpty(selectedOptions.quickFilter) && selectedOptions.quickFilter.department !== 'All Departments') {
            const match = dept.filter(item => item.name === _get(selectedOptions, 'quickFilter.department'));
            if (match.length) {
                payload['department.id'] = match[0].id;
                this.getFilterOptions(payload);
            }
            this.setState({ previousDept: selectedOptions.quickFilter.department });
        } else if (this.state.previousDept !== 'All Departments') {
            this.getFilterOptions();
        }
        const { quickFilterSelected } = _get(selectedOptions, 'quickFilter', '');
        if (!_isEmpty(quickFilterSelected)) {
            quickFilterCaseCount.forEach((item) => {
                if (quickFilterSelected === item.displayValue) {
                    payload[item.paramKey] = item.value;
                }
            });
        }

        this.getListing(payload);
    }

    noResultFound() {
        return (
            <div className={cx('noResultFound')}>
                <h1>No Results Found.</h1>
            </div>
        );
    }

    render() {
        const { caseList, notifications, maxThreshold, caseRequest, filterOptions } = this.props;
        const { departmentList } = caseRequest;
        const caseCount = (caseList && caseList.count) ? (caseList.count) : 0;
        const caseData = caseList && caseList.cases ? caseList.cases : '';
        const arrayCount = caseData.length;
        const enableExternalSort = caseCount && caseCount > maxThreshold;
        const caseColumnWithLink = this.getUpdatedCaseColumn();

        return (
            <div className={cx('myCase')}>
                <div className={cx('caseItemsBody')}>
                    {this.props.isLoading ? <Loader
                        keepOverlay
                        data-automation-id="case-details-loader"
                        loaderClass={styles.loaderClass} /> : ''}
                    <LoadSVG svgPaths={[coreSprite, siteSprite]} />
                    <div className={cx('topMenu')}>
                        <div className={cx('xl6', 'lg6', 'md6', 'sm6')}>

                            <ul className={cx('myCaseMenu')}>
                                <li><a
                                    href="javascript:void(0);" data-automation-id="my-cases" role="button" className={this.state.selectedTab === 'myCases' ? cx('active') : ''}
                                    onClick={() => this.switchTab('myCases')}>My Cases</a></li>
                                <li><a
                                    href="javascript:void(0);" data-automation-id="department-cases" role="button" className={this.state.selectedTab === 'deptCases' ? cx('active') : ''}
                                    onClick={() => this.switchTab('deptCases')}>Department Cases</a></li>
                                <li><a
                                    href="javascript:void(0);" data-automation-id="dashboard" role="button" className={this.state.selectedTab === 'dashboard' ? cx('active') : ''}
                                    onClick={() => this.switchTab('dashboard')}>Dashboard</a></li>
                            </ul>

                        </div>
                        <div className={cx('xl6', 'lg6', 'md6', 'sm6', 'caseHeaderRgt')}>
                            <CaseHeader
                                refresh={this.refreshSearch} notifications={notifications}
                                action={this.props.actions} />

                        </div>
                    </div>

                    <Filter
                        brickFilterOptions={caseList}
                        caseCount={caseCount}
                        departmentList={departmentList}
                        filterOptions={filterOptions}
                        onFilterChange={this.applyFilter}
                    />
                    <div className={cx('myCaseBody')}>
                        <div className={(this.state.selectedTab === 'myCases' || this.state.selectedTab === 'deptCases') ? '' : cx('hideTablePanel')}>
                            {/* My Cases Table */}
                            {caseData && arrayCount > 0 ?
                                <div>
                                    <TablePanel
                                        rowData={caseData}
                                        colData={(updatedCaseColumn.length) === 0 ?
                                            caseColumnWithLink : updatedCaseColumn}
                                        showPagination
                                        enableExternalSort={enableExternalSort}
                                        handleExternalSort={enableExternalSort && this.sortCallback}
                                        totalRecords={caseCount}
                                        getNewPage={this.getNewPage}
                                        maxThreshold={maxThreshold}
                                        dropContent={cx('paginationDropdown')}
                                        theme={cx('tablePanelSearchContainer')}
                                    />
                                </div> : this.noResultFound()}
                        </div>

                        <div className={this.state.selectedTab === 'deptCases' ? '' : cx('hideTablePanel')}>
                            {this.noResultFound()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = store => ({
    maxThreshold: _get(store.context, 'preferences.tablePanelMaxThreshold', 0),
    caseList: store.caseItems.caseDetailsResponse,
    notifications: store.notifications,
    caseRequest: store.caseItems,
    preferences: store.context.preferences,
    filterOptions: store.caseFilter,
    isLoading: store.caseItems.isLoading,
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign(
        messagesActions, caseItemActions, caseSearchActions, CaseDetailsActions,
        NotificationsAction, caseFilterActions, LoaderAction), dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CaseItems);
