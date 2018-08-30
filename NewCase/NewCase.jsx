import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames/bind';
import { Input } from 'fusion-core-components/lib/components';
import Icon from 'fusion-core-components/lib/components/Icon/Icon';
import CustomerContact from '../CustomerContact/CustomerContact';
import styles from './NewCase.css';
import CreateNewCase from './CreateNewCase/CreateNewCase';

const cx = classNames.bind(styles);
export class NewCase extends Component {
    static defaultProps = {
        newCaseInfo: {},
        actions: {},
        params: {},
        caseDetails: {},
        isEditCase: false,
        preferences: {},
    };

    static propTypes = {
        newCaseInfo: PropTypes.objectOf(PropTypes.object).isRequired,
        actions: PropTypes.objectOf(PropTypes.object).isRequired,
        params: PropTypes.objectOf(PropTypes.object).isRequired,
        caseDetails: PropTypes.objectOf(PropTypes.object).isRequired,
        isEditCase: PropTypes.bool,
        preferences: PropTypes.objectOf(PropTypes.object),

    };

    componentWillReceiveProps = (nextProps) => {
        const { params, newCaseInfo } = this.props;
        const { caseId } = params;
        const { updateSuccess } = newCaseInfo;
        if (updateSuccess === false && nextProps.newCaseInfo.updateSuccess === true) {
            const urlPage = `/case/${caseId}`;
            browserHistory.push(urlPage);
        }
    }
    updateCaseOpertion = (value) => {
        const { params, preferences } = this.props;
        const { agentId } = preferences;
        const { caseId } = params;
        const caseInfo = this.props.newCaseInfo;
        const isCallerContact = caseInfo.addCallerContact;
        const phoneNumber = value.phoneNumber ? value.phoneNumber.replace(/-|\s/g, '') : '';
        const { caseDetails } = this.props.newCaseInfo;
        const { contacts } = caseDetails;
        let isClean = true;

        const paramData = {
            caseID: caseId,
            agent: {
                id: agentId,
            },
        };
        if (isCallerContact
            && (contacts[1].phoneNumber !== phoneNumber || contacts[1].email !== value.email)) {
            isClean = false;
            const prevCallerContact = contacts[1];
            const inputValues = {};
            if (prevCallerContact.phoneNumber !== phoneNumber) {
                inputValues.phoneNumber = phoneNumber;
            }
            if (prevCallerContact.email !== value.email) {
                inputValues.email = value.email;
            }
            paramData.contacts = [{ type: 'caller', ...inputValues }];
        } else if (contacts.length === 1) {
            const prevContactInfo = contacts[0];
            if (prevContactInfo.type === 'guest' && (prevContactInfo.firstName !== value.firstName
                || prevContactInfo.lastName !== value.lastName
                || prevContactInfo.address1 !== value.streetAddress
                || prevContactInfo.address2 !== value.apt
                || caseDetails.priority !== value.priority)) {
                isClean = false;
                const inputValues = {};
                if (prevContactInfo.firstName !== value.firstName) {
                    inputValues.firstName = value.firstName;
                }
                if (prevContactInfo.lastName !== value.lastName) {
                    inputValues.lastName = value.lastName;
                }
                if (prevContactInfo.address1 !== value.streetAddress) {
                    inputValues.address1 = value.streetAddress;
                }
                if (prevContactInfo.address2 !== value.apt) {
                    inputValues.address2 = value.apt;
                }
                paramData.contacts = [{ type: 'guest', ...inputValues }];
                if (caseDetails.priority !== value.priority) {
                    paramData.priority = value.priority;
                }
            } else if (prevContactInfo.type === 'registered' && (caseDetails.priority !== value.priority)) {
                isClean = false;
                if (caseDetails.priority !== value.priority) {
                    paramData.priority = value.priority;
                }
            }
        }

        if (isClean) {
            return null;
        }

        this.props.actions.doUpdateCase(paramData);
        return '';
    }
    submitCase = (values) => {
        const { isEditCase } = this.props;

        if (isEditCase) {
            this.updateCaseOpertion(values);
        } else {
            this.createOperation(values);
        }
    }
    createOperation = (value) => {
        const { preferences } = this.props;
        const { agentId } = preferences;
        const caseInfo = this.props.newCaseInfo;
        const isRegisteredUser = caseInfo.contactAvailable;
        const isCallerContact = caseInfo.addCallerContact;
        const contact = caseInfo.contactDetails;
        const phoneNumber = value.phoneNumber ? value.phoneNumber.replace(/-|\s/g, '') : '';
        const paramData = {
            agent: {
                id: agentId,
            },
            caseType: value.caseType,
            priority: value.priority,
            description: value.desc,
            orderNumber: value.order,
            contacts: [
                {
                    type: isRegisteredUser ? 'Registered' : 'Guest',
                    id: isRegisteredUser ? contact.id : '',
                    firstName: isRegisteredUser ? contact.firstName : value.firstName,
                    lastName: isRegisteredUser ? contact.lastName : value.lastName,
                    phoneNumber: isRegisteredUser ? contact.phoneNumber : phoneNumber,
                    email: isRegisteredUser ? contact.email : value.email,
                    address1: isRegisteredUser ? contact.address1 : value.streetAddress,
                    address2: isRegisteredUser ? contact.address2 : value.apt,
                    city: isRegisteredUser ? contact.city : value.city,
                    state: isRegisteredUser ? contact.state : value.state,
                    zipCode: isRegisteredUser ? contact.zipCode : value.zip,
                    country: 'USA',
                },
            ],
        };
        let callerContactInfo;
        if (isCallerContact) {
            callerContactInfo = {
                type: 'caller',
                firstName: value.firstName,
                lastName: value.lastName,
                phoneNumber: value.phoneNumber ? value.phoneNumber.replace(/-|\s/g, '') : '',
                email: value.email,
            };
            paramData.contacts.push(callerContactInfo);
        }
        this.props.actions.doCreateNewCase(paramData);
    };
    backToSearch = () => {
        browserHistory.goBack();
    }
    render() {
        const { newCaseInfo, params, isEditCase } = this.props;
        const {
            contactDetails,
            contactAvailable,
        } = newCaseInfo;
        const { caseId } = params;
        const titleStr = caseId ? 'Edit Case Details' : 'New Case';
        return (
            <div className={cx('newCase')}>
                <div className={cx('topMenu')}>
                    <div className={cx('xl12', 'lg12', 'md12', 'sm12')}>
                        <div className={cx('backArrow')}>
                            <button data-automation-id="back-btn" onClick={this.backToSearch}>
                                <Icon iconType="svg" viewBox="0 0 32 32" width="32px" height="32px" name="arrow" pathClassName={cx('iconColor')} className={cx('backIcon')}/>
                            </button>
                        </div>
                        <div className={cx('newCaseTitle')}>Back</div>
                    </div>
                </div>
                <div className={cx('newCaseBody')}>
                    <div className={cx('newCaseInner')}>
                        <div className={cx('caseInnerTitle')}>{titleStr}</div>
                        {contactAvailable ?
                            (<CustomerContact
                                contactDetails={contactDetails}
                                isEditCase={isEditCase} />) :
                            (<div className={cx('newCaseSearchBlock')}>
                                <Input
                                    type="text"
                                    id="Search"
                                    data-automation-id="search"
                                    name="Search"
                                    placeholder="Search by Name, Email or Phone"
                                    className={cx('newcasesearchInput')}
                                />
                                <span className={cx('searchIcon')}>
                                    <Icon
                                        iconType="svg"
                                        classNames="icon"
                                        viewBox="0 0 32 32"
                                        width="32px"
                                        height="32px"
                                        data-automation-id="collapse-right"
                                        name="search-case"
                                        pathClassName={cx('rightIcon')}
                                    />
                                </span>
                            </div>)
                        }
                        <div className={cx('newCaseForm')}>
                            <CreateNewCase
                                params={params}
                                isEditCase={isEditCase} caseInfo={newCaseInfo}
                                submitCase={this.submitCase}
                                newCaseInfo={newCaseInfo}
                            />
                        </div>
                        <div className={cx('clear')} />
                    </div>
                </div>
            </div>
        );
    }
}
export default(NewCase);

