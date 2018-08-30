import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import YodaDropdown from 'yoda-fusion-site-components/lib/components/YodaDropdown/YodaDropdown';
import Input from 'fusion-core-components/lib/components/Input/Input';
import Button from 'fusion-core-components/lib/components/Button/Button';
import ModalBox from 'fusion-core-components/lib/components/ModalBox/ModalBox';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Field, reduxForm, isDirty } from 'redux-form';
import styles from '../NewCase.css';
import validate, { normalizePhone, restrictmaxLength, normalizeZip } from './Validate';
import { removeFirstSpace } from '../../../common/Util';

const cx = classNames.bind(styles);
/* eslint-disable react/prop-types */
export const renderFieldInput = ({ disabled, input, label, type, id, maxLength,
    dataAutomationId, meta: { touched, error } }) => (
        <div className={cx('group', disabled ? 'disabled' : '')}>
            <label htmlFor={id}>{label}</label>
            <div>
                <Input
                    {...input}
                    size={maxLength}
                    id={id}
                    type={type}
                    readOnly={disabled}
                    data-automation-id={dataAutomationId} />
                {touched && error && <p className={cx('error')}>{error}</p>}
            </div>
        </div>);
// Rednering selectDropdown
/* eslint-disable react/prop-types */
export const renderSelectDropdown = ({ disabled, input, label, id, datasource,
    meta: { touched, error } }) => {
    let val = (datasource || []).filter(e => e.value === input.value);
    const isActive = val && val.length && val[0].displayKey;
    val = val && val.length && val[0].displayKey ? val[0].displayKey : 'Select an Option...';
    const disable = disabled ? 'disabled' : '';
    return (
        <div className={cx('group')}>
            <label htmlFor={id}>{label}</label>
            <YodaDropdown
                {...input}
                dataSource={datasource}
                data-automation-id="action-list-dropdown"
                defaultValue={val}
                mobileTheme={cx('dropdown')}
                theme={cx('wrapper', isActive ? 'active' : '', disable)}
                optionsTheme={cx('optionsTheme')}
                dropdownTheme={cx('dropdownTheme')}
                labelTheme={cx('defaultDisplay')}
                toolTip={cx('tooltip')}
                tooltipWrapper={cx('tooltipWrapper')}
                toolContent={cx('toolContent')}
                tooltipBodyClassName={cx('tooltipContainer')}
            />
            {touched && error && <p className={cx('error')}>{error}</p>}
        </div>);
};
// Rednering textarea
/* eslint-disable react/prop-types */
export const renderTextArea = ({ disabled, id, input, label, meta: { touched, error } }) => (
    <div className={cx('group', disabled ? 'disabled' : '')}>
        <label htmlFor={id}>{label}</label>
        <div>
            <textarea {...input} disabled={disabled} placeholder="Type something" />
            {touched && error && <p className={cx('error')}>{error}</p>}
        </div>
    </div>
);

export const normalizeMaxLength = (length, label) => value => restrictmaxLength(value, length, label);

export class CreateNewCase extends Component {
    static propTypes = {
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        phoneNumber: PropTypes.string,
        email: PropTypes.string,
        street: PropTypes.string,
        apt: PropTypes.string,
        zip: PropTypes.string,
        city: PropTypes.string,
        desc: PropTypes.string,
        order: PropTypes.string,
        submitCase: PropTypes.func,
        caseInfo: PropTypes.objectOf(PropTypes.object),
        handleSubmit: PropTypes.func,
        isEditCase: PropTypes.bool,
        dirty: PropTypes.bool,
        preferences: PropTypes.objectOf(PropTypes.object),
    };

    static defaultProps = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        street: '',
        apt: '',
        zip: '',
        city: '',
        states: '',
        desc: '',
        order: '',
        caseInfo: {},
        handleSubmit: {},
        submitCase: {},
        preferences: {},
        isEditCase: false,
        dirty: false,
    };
    constructor() {
        super();
        this.state = {
            alertPopUp: false,
        };
    }

    onInputChange = (e) => {
        const value = removeFirstSpace(e.target.value);
        if (value !== e.target.value) {
            this.props.change(e.target.name, value);
        }
    }
    cancelSubmit = (value) => {
        const caseInfo = this.props.newCaseInfo;
        const isCallerContact = caseInfo.addCallerContact;
        const phoneNumber = value.phoneNumber ? value.phoneNumber.replace(/-|\s/g, '') : '';
        const { caseDetails } = this.props.newCaseInfo;
        const { contacts } = caseDetails;
        let isClean = true;
        if (isCallerContact
            && (contacts[1].phoneNumber !== phoneNumber || contacts[1].email !== value.email)) {
            this.setState({ alertPopUp: true });
            isClean = false;
        } else if (contacts.length === 1) {
            if (contacts[0].phoneNumber !== phoneNumber
                || contacts[0].email !== value.email
                || contacts[0].firstName !== value.firstName
                || contacts[0].lastName !== value.lastName
                || caseDetails.priority !== value.priority) {
                this.setState({ alertPopUp: true });
                isClean = false;
            }
        }
        if (!isClean) {
            return null;
        }
        this.alertProceedButton();
        return '';
    }

    alertProceedButton = () => {
        const { params } = this.props;
        const { caseId } = params;
        const urlPage = `/case/${caseId}`;
        browserHistory.push(urlPage);
    }
    alertCancelButton = () => {
        this.setState({ alertPopUp: false });
    }
    renderModalContent() {
        return (
            <div className={cx('updateContent')}>
                <div className={cx('updateTitle')}>Do you wish to cancel</div>
                <div className={cx('updateButtonBlock')}>
                    <Button data-automation-id="update-cancel-button" buttonType="Tertiary" type="button" size="Xl" className={cx('updateCancelBtn')} onClick={this.alertCancelButton}>Cancel</Button>
                    <Button data-automation-id="update-proceed-button" buttonType="Tertiary" type="button" size="Xl" className={cx('updateProceedBtn')} onClick={this.alertProceedButton}>Proceed</Button>
                </div>
            </div>

        );
    }

    render() {
        const handleSubmitForm = (values) => {
            this.props.submitCase(values);
        };

        const {
            firstName,
            lastName,
            phoneNumber,
            email,
            street,
            apt,
            zip,
            city,
            desc,
            order,
            contactAvailable,
            addCallerContact,
        } = this.props.caseInfo;
        const { handleSubmit, preferences, isEditCase, dirty } = this.props;
        const { caseType, priorityList, statesList } = preferences;
        const isDisable = addCallerContact && isEditCase;
        const isDisablePhoneOrEmail = !addCallerContact && isEditCase;
        const defaultCloseBtn = false;

        return (
            <div>
                <form onChange={e => this.onInputChange(e)} onSubmit={handleSubmit(handleSubmitForm)}>

                    {(addCallerContact || !contactAvailable) && (
                    <span>
                        <div className={cx('xl6', 'lg6', 'md6', 'sm12', 'padLft0')}>
                            <Field
                                className={cx('newcaseInput')}
                                label="First Name"
                                type="text"
                                value="fsdhfsdh"
                                name="firstName"
                                id="firstName"
                                data-automation-id="newcase-first-name"
                                defaultValue={firstName}
                                component={renderFieldInput}
                                disabled={isDisable}
                            />
                        </div>
                        <div className={cx('xl6', 'lg6', 'md6', 'sm12', 'padRgt0')}>
                            <Field
                                className={cx('newcaseInput')}
                                label="Last Name"
                                type="text"
                                name="lastName"
                                data-automation-id="newcase-last-name"
                                defaultValue={lastName}
                                component={renderFieldInput}
                                disabled={isDisable}
                            />
                        </div>
                        <div className={cx('xl6', 'lg6', 'md6', 'sm12', 'padLft0')}>
                            <Field
                                className={cx('newcaseInput')}
                                label="Phone"
                                type="text"
                                name="phoneNumber"
                                normalize={normalizePhone}
                                data-automation-id="newcase-phone"
                                defaultValue={phoneNumber}
                                component={renderFieldInput}
                                disabled={isDisablePhoneOrEmail}
                            />
                        </div>
                        <div className={cx('xl6', 'lg6', 'md6', 'sm12', 'padRgt0')}>
                            <Field
                                className={cx('newcaseInput')}
                                label="Email"
                                id="email"
                                type="text"
                                name="email"
                                data-automation-id="newcase-email"
                                defaultValue={email}
                                component={renderFieldInput}
                                disabled={isDisablePhoneOrEmail}
                            />
                        </div>
                    </span>
                )}
                    {!contactAvailable && (
                    <span>
                        <div className={cx('xl9', 'lg9', 'md9', 'sm12', 'street', 'pad0')}>
                            <Field
                                id="street"
                                type="text"
                                name="streetAddress"
                                data-automation-id="newcase-street"
                                defaultValue={street}
                                component={renderFieldInput}
                                normalize={normalizeMaxLength(250)}
                                label="Street"
                                className={cx('newcaseInput')}
                            />
                        </div>
                        <div className={cx('xl3', 'lg3', 'md3', 'sm12', 'aptSuite', 'pad0')}>
                            <Field
                                id="apt-suite-bldg"
                                type="text"
                                name="apt"
                                data-automation-id="newcase-apt-suite-bldg"
                                defaultValue={apt}
                                component={renderFieldInput}
                                label="Apt, Suite, Bldg"
                                className={cx('newcaseInput')}
                            />
                        </div>

                        <div className={cx('xl3', 'lg3', 'md3', 'sm12', 'zip', 'pad0')}>
                            <Field
                                id="zip"
                                type="text"
                                name="zip"
                                normalize={normalizeZip}
                                value={zip}
                                maxLength="5"
                                data-automation-id="newcase-zip"
                                defaultValue={zip}
                                component={renderFieldInput}
                                label="Zip"
                                className={cx('newcaseInput')}
                                disabled={isEditCase}
                            />
                        </div>
                        <div className={cx('xl5', 'lg4', 'md4', 'sm12', 'city')}>
                            <Field
                                id="city"
                                type="text"
                                name="city"
                                value={city}
                                placeholder="City"
                                normalize={normalizeMaxLength(50, 'city')}
                                data-automation-id="newcase-city"
                                defaultValue={city}
                                component={renderFieldInput}
                                label="City"
                                className={cx('newcaseInput')}
                                disabled={isEditCase}
                            />
                        </div>
                        <div className={cx('xl4', 'lg4', 'md4', 'sm12', 'state', 'pad0')}>
                            <Field
                                id="State"
                                datasource={statesList}
                                name="state"
                                label="State"
                                data-automation-id="newcase-state"
                                defaultValue="Select an Option..."
                                component={renderSelectDropdown}
                                disabled={isEditCase}
                            />
                        </div>
                    </span>
                )}
                    <div className={cx('xl6', 'lg6', 'md6', 'sm12', 'padLft0')}>
                        <Field
                            id="Case"
                            name="caseType"
                            label="Case Type"
                            datasource={caseType}
                            data-automation-id="newcase-type"
                            defaultValue="Select an Option..."
                            component={renderSelectDropdown}
                            disabled={isEditCase}
                    />
                    </div>
                    <div className={cx('xl6', 'lg6', 'md6', 'sm12', 'padRgt0')}>
                        <Field
                            id="Priority"
                            name="priority"
                            label="Priority"
                            datasource={priorityList}
                            data-automation-id="newcase-priority"
                            defaultValue="Select an Option..."
                            component={renderSelectDropdown}
                            disabled={isDisable}
                    />
                    </div>

                    <div className={cx('xl12', 'lg12', 'md12', 'sm12', 'pad0')}>
                        <Field
                            type="text"
                            id="order"
                            name="order"
                            data-automation-id="newcase-order-number"
                            className={cx('newcaseInput')}
                            value={order}
                            label="Order Number"
                            component={renderFieldInput}
                            disabled={isEditCase}
                        />
                    </div>

                    <div className={cx('xl12', 'lg12', 'md12', 'sm12', 'pad0')}>
                        <Field
                            id="desc"
                            name="desc"
                            placeholder="Type something"
                            normalize={normalizeMaxLength(250)}
                            data-automation-id="newcase-desc"
                            value={desc}
                            label="Description"
                            component={renderTextArea}
                            disabled={isEditCase}
                        />

                    </div>

                    {isEditCase ? <div className={cx('float-right')}><span><Button
                        isDisabled={!dirty}
                        id="Submit"
                        automationId="submit-btn"
                        buttonType="Tertiary"
                        data-automation-id="newcase-create-case-button"
                        type="submit"
                        size="xl"
                        className={cx('newCaseBtn', 'float-right')}
                >
                    Save Changes
                </Button></span>
                        <span><Button
                            id="Cancel"
                            automationId="cancel-btn"
                            buttonType="Secondary"
                            data-automation-id="newcase-create-case-button"
                            type="cancel"
                            size="xl"
                            onClick={handleSubmit(this.cancelSubmit)}
                            className={cx('newCaseBtn', 'right')}
                        >
                            Cancel
                </Button></span></div> : <Button
                    id="Submit"
                    automationId="submit-btn"
                    buttonType="Tertiary"
                    data-automation-id="newcase-create-case-button"
                    type="submit"
                    size="xl"
                    className={cx('newCaseBtn', 'right')}
                        >
                            Create Case
                </Button>}
                </form >
                <div className={cx('updatePopupModal')}>
                    <ModalBox
                        showModal={this.state.alertPopUp}
                        onClose={this.state.alertPopUp}
                        defaultHeader
                        defaultCloseBtn={defaultCloseBtn}
                        modalContentTheme={cx('modalContentWrapper')}
                        modalTitleTheme={cx('modalTitle')}
                        modalTheme={cx('storesTablet')}
                        modalBlockTheme={cx('pdpCustomModalBlock')}
                    >
                        {this.renderModalContent()}
                    </ModalBox>
                </div>
            </div>
        );
    }
}

const CreateNewCaseForm = reduxForm({
    form: 'submitValidation',
    validate,
})(CreateNewCase);

const ConnectedCustomOptionsForm = connect(
    state => ({
        dirty: isDirty('myForm'),
        initialValues: state.newCaseInfo && state.newCaseInfo.initValue,
        preferences: state.context.preferences,
        enableReinitialize: true,
    }), null,
)(CreateNewCaseForm);
export default ConnectedCustomOptionsForm;

