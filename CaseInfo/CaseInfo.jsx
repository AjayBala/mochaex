import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import styles from './CaseInfo.css';
import { fomatOrderNumber } from '../../common/Util';

const cx = classNames.bind(styles);

export class CaseInfo extends Component {

    static defaultProps = {
        caseDetailsData: {},
        actions: null,
        preferences: {},
        caseId: PropTypes.Number,
    }

    static propTypes = {
        caseDetailsData: PropTypes.Object,
        actions: PropTypes.Object,
        preferences: PropTypes.objectOf(PropTypes.object),
        caseId: null,
    }
    constructor() {
        super();
        this.state = {
            expanded: false,
        };
    }
    onClickAssign = () => {
        const { agentId } = this.props.preferences;
        const params = { id: agentId };
        this.props.actions.doCaseOperation('AGENT',
                this.props.caseId,
                params,
                agentId);
    }

    reopenCase = () => {
        const { preferences } = this.props;
        const { actionReopenCase } = preferences;
        this.props.actions.onSelectCaseOperation({ showCaseOperationModal: true, actionType: actionReopenCase });
    }
    closeReopenCase = () => {
        this.props.actions.closeCaseModal({ showCaseOperationModal: false });
    }
    backToSearch = () => {
        browserHistory.push('/case/search');
    }
    toggleFilterBox = () => {
        this.setState({ expanded: !this.state.expanded });
    }

    render () {
        const { caseDetailsData, preferences } = this.props;
        const { minCharDesc } = preferences;
        const fomattedOrder = fomatOrderNumber(caseDetailsData.orderNumber) ? fomatOrderNumber(caseDetailsData.orderNumber) : 'None';
        const caseInfoAddress = caseDetailsData && caseDetailsData.contacts ? caseDetailsData.contacts : '';
        const caseAddress = caseInfoAddress && caseInfoAddress.map((item, index) => {
            let validPhoneNum;
            if (item.phoneNumber) {
                const PhoneNo = item.phoneNumber;
                validPhoneNum = `${PhoneNo.slice(0, 3)} ${PhoneNo.slice(3, 6)}-${PhoneNo.slice(6, 10)}`;
            }
            return (<div>
                <div id={index} className={cx('caseSubTitle')}>{(item.type) === 'registered' || (item.type) === 'guest' ? 'Customer Contact' : ''}{(item.type) === 'caller' ? 'Caller Contact' : ''}</div>
                <div className={cx('caseDescription')} data-automation-id="address-details">
                    <p>{item.firstName} {item.lastName}</p>
                    <p>{item.address1}</p>
                    <p>{item.city}{item.city ? ',' : ''} {item.state} {item.zipCode}</p>
                    <p>{validPhoneNum}</p>
                    <p>{item.email}</p>
                </div>
                <br />
            </div>);
        });
        const associateName = (caseDetailsData.agent || {}).name;
        const status = (caseDetailsData.status && (caseDetailsData.status.value === 'Closed' || caseDetailsData.status.value === 'Archived')) ? <a data-automation-id="reopen-case-button" href="javascript:void(0);" role="button" onClick={this.reopenCase}>Reopen Case</a> : '';
        const { expanded } = this.state;
        const readType = expanded ? <span><a href="javascript:void(0);" data-automation-id="hide-btn" role="button" onClick={this.toggleFilterBox}> Hide</a></span> : <span>... <a href="javascript:void(0);" data-automation-id="read-more-btn" role="button" onClick={this.toggleFilterBox}>Read More</a></span>;
        let detailsDesc = caseDetailsData.description;
        let minDesc;
        let currentDesc;
        if (detailsDesc && detailsDesc.length > minCharDesc) {
            minDesc = detailsDesc.slice(0, minCharDesc);
            currentDesc = expanded ? detailsDesc : minDesc;
            detailsDesc = <p className={cx('caseDescription')} data-automation-id="description-expand">{currentDesc}{readType}</p>;
        } else {
            detailsDesc = <p className={cx('caseDescription')} data-automation-id="description-shrink">{detailsDesc}</p>;
        }
        const department = (caseDetailsData.department || {});
        const departmentName = department.name;
        const { caseType } = department;
        const { type } = caseType || {};
        const viewCase = (caseDetailsData.status || {});
        const viewCaseStatus = viewCase.value;
        return (
            <div className={cx('xl4', 'lg4', 'md4', 'sm12', 'float-left', 'caseInfoContainer')}>
                <div className={cx('caseLeft')}>
                    <p className={cx('caseSubTitle')}>Status</p>
                    <p className={cx('caseDescription')} data-automation-id="status">{viewCaseStatus} &nbsp;&nbsp;&nbsp;{status}</p>

                    <p className={cx('caseSubTitle')}>Associate</p>
                    {(associateName) ? <p className={cx('caseDescription')} data-automation-id="associate-name">{associateName}</p> : <p className={cx('caseDescription')}>None<span><a href="javascript:void(0);" data-automation-id="assign-to-me-button" role="button" onClick={this.onClickAssign}>  Assign To Me</a></span></p>}
                    <br />
                    <p className={cx('caseSubTitle')}>Case Type</p>
                    <p className={cx('caseDescription')} data-automation-id="case-type">{type}</p>

                    <p className={cx('caseSubTitle')}>Priority</p>
                    <p className={cx('caseDescription')} data-automation-id="priority">{caseDetailsData.priority}</p>

                    <p className={cx('caseSubTitle')}>Department</p>
                    <p className={cx('caseDescription')} data-automation-id="department-name">{departmentName}</p>

                    <p className={cx('caseSubTitle')}>Order Number</p>
                    <p className={cx('caseDescription')} data-automation-id="fomatted-order">{fomattedOrder}</p>

                    <br />
                    <p className={cx('caseSubTitle')} data-automation-id="description">Description</p>
                    {detailsDesc}
                    <br />
                    {caseAddress}
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => ({
    caseDetailsData: store.caseDetailsData.caseDetailsData,
    showCaseOperationModal: store.caseDetailsData.showCaseOperationModal,
    actionType: store.caseDetailsData.actionType,
    preferences: store.context.preferences,
});

export default connect(mapStateToProps, null)(CaseInfo);
