import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import YodaDropdown from 'yoda-fusion-site-components/lib/components/YodaDropdown/YodaDropdown';
import classNames from 'classnames/bind';
import Button from 'fusion-core-components/lib/components/Button/Button';
import ModalBox from 'fusion-core-components/lib/components/ModalBox/ModalBox';
import * as CaseOperationModalAction from '../../actions/CaseOperationModalAction';
import { isNumeric } from '../../common/Util';
import styles from './CaseOperationModal.css';

const cx = classNames.bind(styles);

export class CaseOperationModal extends Component {
    static propTypes = {
        showModal: PropTypes.bool,
        closeModal: PropTypes.func,
        actions: PropTypes.objectOf(PropTypes.func),
        actionType: PropTypes.string,
        caseId: PropTypes.Number,
        commonDetails: PropTypes.Object,
        preferences: PropTypes.objectOf(PropTypes.object),
        caseDetails: PropTypes.Object,
        caseDetailsError: PropTypes.Object,
    };
    static defaultProps = {
        bundleDiscountApplied: false,
        showModal: false,
        closeModal: null,
        actions: null,
        actionType: null,
        caseId: null,
        commonDetails: {},
        preferences: {},
        caseDetails: {},
        caseDetailsError: null,
    };
    constructor() {
        super();
        this.state = {
            showModal: false,
            desc: '',
            originalCaseId: '',
            hasError: false,
            descError: '',
            deptError: '',
            agentError: '',
            selectReasonError: '',
            caseIdError: '',
            dropDownData: [],
            agentDropDownText: 'Select an Option...',
            deptDropDownText: 'Select an Department...',
            reasonDropDownText: 'Select Reason...',
            reasonDropDownValue: null,
            selectedAgentId: null,
            selectedDeptId: null,
        };
    }
    componentWillReceiveProps = (nextProps) => {
        const { showModal } = this.props;
        if (showModal === false && nextProps.showModal === true) {
            this.setState({
                hasError: false,
                descError: '',
                desc: '',
                originalCaseId: '',
                caseIdError: '',
            });
        }
    }
    onChangeAgent = (value) => {
        const { commonDetails } = this.props;
        const agentList = commonDetails.agentList ? commonDetails.agentList : null;
        const object = (agentList || []).find(e => e.value === value);
        this.setState({
            agentDropDownText: object && object.name ? object.name : 'Select an Option...',
            selectedAgentId: value,
            agentError: '',
        });
    }
    onChangeDepartment = (value) => {
        const { commonDetails } = this.props;
        const departmentList = commonDetails.departmentList ? commonDetails.departmentList : null;
        const object = (departmentList || []).find(e => e.value === value);
        this.setState({
            deptDropDownText: object && object.name ? object.name : 'Select an Department...',
            selectedDeptId: value,
            deptError: '',
        });
    }
    onReasonChangeAction = (value) => {
        const { preferences } = this.props;
        const { changeDeptReasons } = preferences;
        const object = (changeDeptReasons).find(e => e.value === value);
        this.setState({
            reasonDropDownText: object && object.displayKey ? object.displayKey : 'Select Reason...',
            reasonDropDownValue: value,
            selectReasonError: '',
        });
    }
    onInputChange = (event, field) => {
        if (field === 'originalCaseId') {
            const originalCaseId = event.target.value;
            this.setState({ originalCaseId }, this.validate);
        } else if (field === 'desc') {
            if (this.state.desc.length === 0) {
                event.target.value = event.target.value.replace(/\s+/g, '');
            }
            const desc = event.target.value;
            this.setState({ desc }, this.validate);
        }
    }
    getRequestParams = (type) => {
        const { preferences } = this.props;
        const { operationLabels, agentId, agentName, actionAddCase, actionCloseAsDuplicate,
            actionReleaseCase } = preferences;
        let params = {};
        const labels = operationLabels[this.props.actionType] || operationLabels[actionAddCase];
        if (type === 'EXPLICIT') {
            params = {
                type: this.props.actionType,
                source: {
                    id: agentId,
                    name: agentName,
                },
                note: this.state.desc,
            };

            if (this.props.actionType === actionReleaseCase) {
                params.destination = {
                    id: this.props.caseDetails.department.id,
                    name: this.props.caseDetails.department.name,
                };
            }
        } else if (type === 'EXPIRY') {
            params = {
                note: this.state.desc,
            };
        } else if (type === 'AGENT') {
            params = {
                id: this.state.selectedAgentId,
                note: this.state.desc,
            };
        } else if (type === 'DEPT') {
            params = {
                id: this.state.selectedDeptId,
                note: this.state.desc,
                reason: this.state.reasonDropDownValue,
            };
        } else if (type === 'STATUS') {
            const { statusId } = labels;
            params = {
                id: statusId,
                note: this.state.desc,
            };
            if (this.props.actionType === actionCloseAsDuplicate) {
                params = {
                    id: statusId,
                };
            }
        }

        return params;
    }
    getActionTypeStr = () => {
        let ret = null;
        const { preferences } = this.props;
        const { operationExplicit, operationImplicitStatus, operationImplicitAgent,
            operationImplicitDept, operationImplicitExpiry } = preferences;
        if (operationExplicit.indexOf(this.props.actionType) !== -1) {
            ret = 'EXPLICIT';
        } else if (operationImplicitStatus.indexOf(this.props.actionType) !== -1) {
            ret = 'STATUS';
        } else if (operationImplicitAgent.indexOf(this.props.actionType) !== -1) {
            ret = 'AGENT';
        } else if (operationImplicitDept.indexOf(this.props.actionType) !== -1) {
            ret = 'DEPT';
        } else if (operationImplicitExpiry.indexOf(this.props.actionType) !== -1) {
            ret = 'EXPIRY';
        }

        return ret;
    }
    validateDropDown = () => {
        const { preferences, actionType } = this.props;
        const { actionAssignCase, actionChangeDept } = preferences;
        const selectedAgentId = this.state.selectedAgentId;
        const selectedDeptId = this.state.selectedDeptId;
        const reasonId = this.state.reasonDropDownValue;
        let isValid = true;
        let agentError = '';
        let deptError = '';
        let selectReasonError = '';

        if (actionType === actionAssignCase) {
            if (!selectedAgentId) {
                isValid = false;
                agentError = 'Select Agent';
            }
        } else if (actionType === actionChangeDept) {
            if (!reasonId) {
                isValid = false;
                selectReasonError = 'Select Reason Type';
            }
            if (!selectedDeptId) {
                isValid = false;
                deptError = 'Select Department';
            }
        }
        this.setState({ selectReasonError, hasError: !isValid, agentError, deptError });

        return isValid;
    }
    validate = (isSubmit) => {
        const { preferences, actionType } = this.props;
        const { minChar,
            minCharForCaseId,
            actionCloseAsDuplicate,
            actionAssignCase,
            actionChangeDept,
            maxChar } = preferences;
        const descNotReqTypes = [actionAssignCase, actionChangeDept];
        const desc = this.state.desc;
        let isValid = true;
        let descError = '';
        let caseIdError = '';
        const mandatoryCheck = isSubmit || false;
        const originalCaseId = this.state.originalCaseId;
        if (actionType === actionCloseAsDuplicate) {
            if (!originalCaseId) {
                if (mandatoryCheck) {
                    isValid = false;
                    caseIdError = 'This is Mandatory';
                }
            } else if (!isNumeric(originalCaseId)) {
                isValid = false;
                caseIdError = 'Alphabetic values are not allowed';
            } else if (originalCaseId.length > minCharForCaseId) {
                isValid = false;
                caseIdError = 'Max 14 characters allowed';
            }
        } else if (actionType !== actionCloseAsDuplicate) {
            if (!desc) {
                if (mandatoryCheck && !(descNotReqTypes.indexOf(actionType) !== -1)) {
                    isValid = false;
                    descError = 'This is Mandatory';
                }
            } else if (desc.length < minChar) {
                isValid = false;
                descError = 'Min 15 characters required';
            } else if (desc.length > maxChar) {
                isValid = false;
                descError = 'Max 250 characters allowed';
            }
        }
        this.setState({ descError, hasError: !isValid, caseIdError });

        return isValid;
    }
    submit = () => {
        const isDropDownValid = this.validateDropDown();
        const { preferences, actionType } = this.props;
        const { agentId, actionCloseAsDuplicate } = preferences;
        const isValid = this.validate(true);
        if (isDropDownValid && isValid) {
            let originalCaseId = null;
            if (actionType === actionCloseAsDuplicate) {
                originalCaseId = this.state.originalCaseId;
            }
            const getActionTypeStr = this.getActionTypeStr();
            const params = this.getRequestParams(getActionTypeStr);
            this.props.actions.doCaseOperation(getActionTypeStr,
                this.props.caseId,
                params,
                agentId,
                originalCaseId);
            this.resetDropDownText();
        }
    }
    resetDropDownText = () => {
        this.setState({
            agentDropDownText: 'Select an Option...',
            deptDropDownText: 'Select an Department...',
            reasonDropDownText: 'Select Reason...',
            selectReasonError: '',
            deptError: '',
            agentError: '',
            reasonDropDownValue: null,
            selectedAgentId: null,
            selectedDeptId: null,
        });
    }
    closeModalBox = () => {
        this.resetDropDownText();
        const { closeModal } = this.props;
        closeModal();
    }
    buildDropDown = (dropDownlabel, dropDownText, data, changeFunction, errMessge) => (
        <div className={cx('group')}>
            <label htmlFor="Suffix">{dropDownlabel}</label>
            <YodaDropdown
                dataSource={data} data-automation-id="action-list-dropdown" onChange={changeFunction}
                defaultValue={dropDownText}
                mobileTheme={cx('dropdown')}
                theme={cx('wrapper', (dropDownText.indexOf('Select') === -1 ? 'active' : ''))}
                optionsTheme={cx('optionsTheme')}
                dropdownTheme={cx('dropdownTheme')}
                labelTheme={cx('defaultDisplay')}
                toolTip={cx('tooltip')}
                tooltipWrapper={cx('tooltipWrapper')}
                toolContent={cx('toolContent')}
                tooltipBodyClassName={cx('tooltipContainer')}
            />
            <p className={cx('error')}>{errMessge}</p>
        </div>
    )
    renderModalContent = () => {
        const { commonDetails, actionType, preferences, caseDetailsError } = this.props;
        const { errorMessage } = (caseDetailsError || {});
        const { changeDeptReasons,
            operationLabels,
            actionAddCase,
            actionCloseAsDuplicate,
            actionAssignCase,
            actionChangeDept,
            actionCloseCase,
            actionReleaseCase,
            actionEscalateCase,
            actionExtendCase,
            actionReopenCase } = preferences;
        let agentList = commonDetails.agentList ? commonDetails.agentList : [];
        let departmentList = commonDetails.departmentList ? commonDetails.departmentList : [];
        let isFocusDescArea = false;
        let isFocusOriginalCaseId = false;
        const types = [actionAddCase,
            actionCloseCase,
            actionEscalateCase,
            actionExtendCase,
            actionReleaseCase,
            actionReopenCase];
        if (types.indexOf(actionType) !== -1) {
            isFocusDescArea = true;
        } else if (actionType === actionCloseAsDuplicate) {
            isFocusOriginalCaseId = true;
        }
        agentList = agentList && agentList.map((item) => {
            item.value = item.id;
            item.displayKey = item.name;
            return item;
        });
        departmentList = departmentList && departmentList.map((item) => {
            item.value = item.id;
            item.displayKey = item.name;
            return item;
        });
        const { reasonDropDownText, agentDropDownText, deptDropDownText, agentError,
            deptError, selectReasonError } = this.state;
        const labels = operationLabels[this.props.actionType] || operationLabels[actionAddCase];
        const { titleTxt, submitTxt } = labels;
        const inputDescLabel = actionType && (actionType === actionAssignCase || actionType === actionChangeDept) ? 'Release Notes' : 'Description';
        let inputField = (<div className={cx('group')}>
            <label htmlFor="Fname">{inputDescLabel}</label>
            <textarea autoFocus={isFocusDescArea} data-automation-id="description" placeholder="Type something" value={this.state.desc} onChange={event => this.onInputChange(event, 'desc')} />
            <p className={cx('error')}>{this.state.descError}</p>
        </div>);
        if (this.props.actionType === actionCloseAsDuplicate) {
            inputField = (<div className={cx('group')}>
                <label htmlFor="Fname">Original Case ID</label>
                <input type="text" data-automation-id="case-id" autoFocus={isFocusOriginalCaseId} placeholder="enter original case #" className={cx('duplicateInput')} value={this.state.caseId} onChange={event => this.onInputChange(event, 'originalCaseId')} />
                <p className={cx('error')}>{this.state.caseIdError || errorMessage || ''}</p>
            </div>);
        }
        return (
            <div className={cx('addCaseNoteContent')}>
                <div className={cx('addCaseNoteTitle')}>{titleTxt}</div>
                {actionType && (actionType === actionAssignCase) ? this.buildDropDown('Assign to Agent', agentDropDownText, agentList, this.onChangeAgent, agentError) : null}
                {actionType && (actionType === actionChangeDept) ? this.buildDropDown('Assign to Department', deptDropDownText, departmentList, this.onChangeDepartment, deptError) : null}
                {actionType && (actionType === actionChangeDept) ? this.buildDropDown('Reason Type', reasonDropDownText, changeDeptReasons, this.onReasonChangeAction, selectReasonError) : null}
                {inputField}

                <Button data-automation-id="add-case-note-button" buttonType="Tertiary" type="button" size="Xl" className={cx('addCaseBtn')} onClick={this.submit}>{submitTxt}</Button>
            </div>
        );
    }
    render() {
        const { showModal } = this.props;
        return (
            <div className={cx('addCaseNoteModal')}>
                <ModalBox
                    showModal={showModal}
                    onClose={this.closeModalBox}
                    defaultHeader
                    modalContentTheme={cx('modalContentWrapper')}
                    modalTitleTheme={cx('modalTitle')}
                    modalTheme={cx('storesTablet')}
                    modalBlockTheme={cx('pdpCustomModalBlock')}>
                    {this.renderModalContent()}
                </ModalBox>

            </div>
        );
    }
}
const mapStateToProps = store => ({
    caseDetails: store.caseDetailsData.caseDetailsData,
    commonDetails: store.caseDetailsData.commonDetails,
    caseDetailsError: store.caseDetailsData.caseDetailsError,
    preferences: store.context.preferences,
});

const mapDispatchToProps = dispatch => (
    {
        actions: bindActionCreators(Object.assign(CaseOperationModalAction), dispatch),
    });
export default connect(mapStateToProps, mapDispatchToProps)(CaseOperationModal);
