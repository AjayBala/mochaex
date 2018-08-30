import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './PrintCase.css';
import { formatPhone, fomatOrderNumber, getDateForTimestamp } from '../../common/Util';

const cx = classNames.bind(styles);

export class PrintCase extends Component {

    static defaultProps = {
        caseDetailsData: {},
        getSourceText: null,
        getDestinationText: null,
    };

    static propTypes = {
        caseDetailsData: PropTypes.Object,
        getSourceText: PropTypes.func,
        getDestinationText: PropTypes.func,
    };

    constructor() {
        super();
        this.state = {};
    }
    render() {
        const { caseDetailsData } = this.props;
        const viewCase = (caseDetailsData.status || {});
        const viewCaseStatus = viewCase.value;
        const caseId = caseDetailsData.id || '';
        const associateName = (caseDetailsData.agent || {}).name;
        const department = (caseDetailsData.department || {});
        const { caseType } = department;
        const { type } = caseType || {};
        const orderNumber = caseDetailsData.orderNumber ? fomatOrderNumber(caseDetailsData.orderNumber) : 'None';
        const departmentName = department.name;
        const detailsDesc = caseDetailsData.description;
        const caseInfoAddress = caseDetailsData && caseDetailsData.contacts ? caseDetailsData.contacts : '';
        const caseAddress = caseInfoAddress && caseInfoAddress.map((item) => {
            let contactType = 'Customer Contact';
            if (item.type === 'caller') {
                contactType = 'Caller Contact';
            }

            return (<p>
                <p className={cx('ppLabel')}>{contactType}</p>
                <p className={cx('caseDescription')}>
                    {item.firstName} {item.lastName} {item.lastName ? <br /> : ''}
                    {item.address1} {item.address1 ? <br /> : ''}
                    {item.city}{item.city ? ',' : ''} {item.state} {item.zipCode} {item.zipCode ? <br /> : ''}
                    {formatPhone(item.phoneNumber)} <br />
                    {item.email}
                </p>
                <br />
            </p>);
        });
        const caseActivities = caseDetailsData && caseDetailsData.activities ? caseDetailsData.activities : '';
        const caseActivity = caseActivities && caseActivities.map((item) => {
            const createdDate = getDateForTimestamp(Number(item.created), 'MM/DD/YYYY h:mm a');
            const sourceText = this.props.getSourceText(item.type);
            const reasonCode = item.reasonCode && item.reasonCode.value ? item.reasonCode.value : null;
            const destinationText = this.props.getDestinationText(item.type);
            return (<div className={cx('ppAgentBlock')}>
                <p className={cx('ppLabel')}>{item.type} <span className={cx('ppDateTime')}>{createdDate}</span></p>
                {item.agent ?
                    <div className={cx('ppAgentLabel')}>Agent : {item.agent}</div> : ''}
                <div>{(item.source || []).map(val => (<p className={cx('ppAgentLabel')}>{sourceText} : {val.name || val.id}</p>))}</div>
                <div>{(item.destination || []).map(val => <p className={cx('ppAgentLabel')}>{destinationText} : {val.name || val.id}</p>)}</div>
                {reasonCode ?
                    <div className={cx('ppAgentLabel')}>Reason Type: {reasonCode}</div> : ''}
                <div className={cx('caseAgent')}>{item.description}</div>
                {item.note ? <div className={cx('caseAgentNote')}>
                    <p className={cx('ppDescription')}>
                        {item.note}
                    </p>
                </div> : '' }
            </div>);
        });
        const associateNameTxt = associateName || 'None';
        return (
            <div className={cx('caseDetails')}>
                <div className={cx('printPreviewContent')}>
                    <div className={cx('ppLogo')}>
                    JCPenney
                    </div>
                    <div className={cx('ppCaseId')}>Case {caseId}</div>
                    <div className={cx('ppStatusBlock')}>
                        <div className={cx('ppLabelCol2')}>
                            <p className={cx('ppLabel')}>Status</p>
                            <p className={cx('ppLabelText')}>{viewCaseStatus}</p>
                        </div>
                        <div className={cx('ppLabelCol2')}>
                            <p className={cx('ppLabel')}>Associate</p>
                            <p className={cx('ppLabelText')}>{associateNameTxt}</p>
                        </div>
                        <div className={cx('clear')} />
                        <div className={cx('ppLabelCol3')}>
                            <p className={cx('ppLabel')}>Case Type</p>
                            <p className={cx('ppLabelText')}>{type}</p>
                        </div>
                        <div className={cx('ppLabelCol2')}>
                            <p className={cx('ppLabel')}>Priority</p>
                            <p className={cx('ppLabelText')}>{caseDetailsData.priority}</p>
                        </div>
                        <div className={cx('ppLabelCol3')}>
                            <p className={cx('ppLabel')}>Department</p>
                            <p className={cx('ppLabelText')}>{departmentName}</p>
                        </div>
                        <div className={cx('ppLabelCol3')}>
                            <p className={cx('ppLabel')}>Order Number</p>
                            <p className={cx('ppLabelText')}>{orderNumber}</p>
                        </div>

                        <div className={cx('ppLabelCol8')}>
                            <p className={cx('ppLabel')}>Description</p>
                            {detailsDesc}
                        </div>

                        <div className={cx('ppLabelCol4')}>
                            {caseAddress}
                        </div>
                    </div>
                    {caseActivity}
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => ({
    caseDetailsData: store.caseDetailsData.caseDetailsData,
});

export default connect(mapStateToProps, null)(PrintCase);
