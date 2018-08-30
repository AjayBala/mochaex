import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import _some from 'lodash/some';
import YodaDropdown from 'yoda-fusion-site-components/lib/components/YodaDropdown/YodaDropdown';
import CaseOperationModal from '../CaseOperationModal/CaseOperationModal';
import styles from './CaseDetails.css';
import { getDateForTimestamp } from '../../common/Util';
import CaseDetailsFilter from '../CaseDetailsFilter/CaseDetailsFilter';

const cx = classNames.bind(styles);

export class CaseDetails extends Component {

    static defaultProps = {
        caseDetailsData: {},
        caseId: null,
        newCaseInfo: {},
        actions: {},
        actionType: null,
        showCaseOperationModal: false,
        preferences: {},
        getSourceText: null,
        getDestinationText: null,
    }

    static propTypes = {
        caseDetailsData: PropTypes.Object,
        newCaseInfo: PropTypes.Object,
        caseId: PropTypes.Number,
        actions: PropTypes.Object,
        actionType: PropTypes.Object,
        showCaseOperationModal: PropTypes.Object,
        preferences: PropTypes.Object,
        getSourceText: PropTypes.func,
        getDestinationText: PropTypes.func,
    }
    constructor() {
        super();
        this.state = {
            expanded: false,
            togglePrint: false,
        };
    }
    onChangeAction = (actionType) => {
        const { preferences } = this.props;
        const { editCaseDetails,
            actionAddCase,
            actionCloseCase,
            actionChangeDept,
            actionCloseAsDuplicate,
            actionEscalateCase,
            actionAssignCase,
            actionReleaseCase,
            actionExtendCase,
            actionPrintCase } = preferences;
        if (actionType === editCaseDetails) {
            const { caseId } = this.props;
            const urlPage = `/case/${caseId}/edit`;
            browserHistory.push(urlPage);
        } else if (actionType === actionPrintCase) {
            this.renderPrintSection();
        } else {
            const types = [actionAddCase,
                actionCloseCase,
                actionCloseAsDuplicate,
                actionEscalateCase,
                actionChangeDept,
                actionReleaseCase,
                actionAssignCase,
                actionExtendCase];

            if (types.indexOf(actionType) !== -1) {
                this.props.actions.onSelectCaseOperation({ showCaseOperationModal: true, actionType });
            }
        }
    }
    closeModal = () => {
        this.props.actions.closeCaseModal({ showCaseOperationModal: false });
    }
    closeStatus = () => {
        const { actions } = this.props;
        const { defaultPopUp } = actions;
        defaultPopUp();
    }
    toggleFilterBox = () => {
        this.setState({
            expanded: !this.state.expanded,
            openAddCaseNote: false,
        });
    }
    renderPrintSection = () => {
        window.print();
    }
    render() {
        const { caseDetailsData, newCaseInfo, preferences } = this.props;
        const { updateStatus } = newCaseInfo;
        const { type, message } = updateStatus;
        const { operationTexts, agentId, popupCloseTimeInMS } = preferences;
        let caseUpdateSuccessMsg;
        if (message) {
            caseUpdateSuccessMsg = preferences.caseUpdateSuccessMsg;
        }
        const { agent } = caseDetailsData;
        let { actionTypes } = caseDetailsData;
        const { id } = agent || {};
        const { expanded } = this.state;
        if (id !== agentId) {
            actionTypes = (actionTypes || []).filter(e => (e.name !== 'Edit Case Details'));
        }
        let caseActivities = caseDetailsData && caseDetailsData.activities ? caseDetailsData.activities : '';
        const caseDetailsFilter = caseDetailsData.caseDetailsFilter || [];
        let filteredItems;
        if (caseDetailsFilter.length) {
            filteredItems = caseActivities.filter((item) => {
                const itemType = item.type;
                return _some(caseDetailsFilter, { type: itemType }) ? item : null;
            });
        }
        caseActivities = filteredItems || caseActivities;
        const caseActivity = caseActivities && caseActivities.map((item, index) => {
            const createdDate = getDateForTimestamp(Number(item.created), 'MM/DD/YYYY h:mm a');
            const reasonCode = item.reasonCode && item.reasonCode.value ? item.reasonCode.value : null;
            const sourceText = this.props.getSourceText(item.type);
            const destinationText = this.props.getDestinationText(item.type);
            return (<li id={index}>
                {(item.type) === 'Case Created' ?
                    <span className={cx('fillColor', 'last')} /> : <span className={cx('whiteColor')} />}
                {(item.type) === 'Case Closed' ?
                    <span className={cx('fillColor', 'last')} /> : ''}
                <div className={cx('caseStatus')}>{operationTexts[item.type] || item.type}
                    <span className={cx('caseDateTime')}>{createdDate}</span>
                </div>
                {item.agent ?
                    <div className={cx('caseDescription')}>Agent : {item.agent}</div> : ''}
                <div>{(item.source || []).map(val => <p>{sourceText} : {val.name || val.id}</p>)}</div>
                <div>{(item.destination || []).map(val => <p>{destinationText} : {val.name || val.id}</p>)}</div>
                {reasonCode ?
                    <div className={cx('caseDescription')}>Reason Type: {reasonCode}</div> : ''}
                <div className={cx('caseAgent')}>{item.description}</div>
                {item.note ? <div className={cx('caseAgentNote')}>
                    <p>
                        {item.note}
                    </p>
                </div> : ''}
            </li>);
        });
        /* istanbul ignore next */
        let alertMessage;
        let alertMessageClassName;
        if (type === 'Success') {
            alertMessage = caseUpdateSuccessMsg;
            alertMessageClassName = 'updateSuccess';
        } else if (type === 'Error') {
            alertMessage = updateStatus.message;
            alertMessageClassName = 'updateError';
        }
        if (type) {
            setTimeout(() => {
                this.closeStatus();
            }, popupCloseTimeInMS);
        }
        return (<div>
            {type && (<div className={cx(alertMessageClassName)}>
                <span>{alertMessage}</span>
                <a href="javascript:void(0);" data-automation-id="close-btn2" className={cx('detailStatusBtn')} onClick={this.closeStatus} role="button">X</a>
            </div>)}
            <div className={cx('xl8', 'lg8', 'md8', 'sm12', 'padRgt0')}>
                <CaseOperationModal
                    actionType={this.props.actionType}
                    caseId={this.props.caseId}
                    showModal={this.props.showCaseOperationModal}
                    closeModal={this.closeModal}/>

                <div className={cx('caseRight')}>
                    <div className={cx('group')}>
                        <label htmlFor="Suffix">New Action</label>
                        <YodaDropdown
                            dataSource={actionTypes} data-automation-id="action-list-dropdown" onChange={this.onChangeAction}
                            defaultValue="Select an Option..."
                            mobileTheme={cx('dropdown')}
                            theme={cx('wrapper')}
                            optionsTheme={cx('optionsTheme')}
                            dropdownTheme={cx('dropdownTheme')}
                            labelTheme={cx('defaultDisplay')}
                            toolTip={cx('tooltip')}
                            tooltipWrapper={cx('tooltipWrapper')}
                            toolContent={cx('toolContent')}
                            tooltipBodyClassName={cx('tooltipContainer')}
                        />
                    </div>
                    <div align="right" className={cx('TitleContainer')}>
                        <div className={cx('filterTxt', 'xl1', 'lg1', 'md1', 'sm6')}>
                            <a href="javascript:void(0);" data-automation-id="filter" onClick={this.toggleFilterBox}>Filter</a>
                            {expanded ?
                                <CaseDetailsFilter toggleFilterBox={this.toggleFilterBox} inputData={this.state} />
                                : null}
                        </div>
                    </div>
                    <div className={cx('caseTimeline')} data-automation-id="case-activity">
                        <ul className={cx('caseTimelineInner')}>
                            {caseActivity}
                        </ul>
                    </div>
                </div>
            </div></div>
        );
    }
}
const mapStateToProps = store => ({
    caseDetailsData: store.caseDetailsData.caseDetailsData,
    showCaseOperationModal: store.caseDetailsData.showCaseOperationModal,
    actionType: store.caseDetailsData.actionType,
    newCaseInfo: store.newCaseInfo,
    preferences: store.context.preferences,
});

export default connect(mapStateToProps, null)(CaseDetails);

