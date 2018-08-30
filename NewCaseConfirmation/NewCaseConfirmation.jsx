import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import classNames from 'classnames/bind';
import Icon from 'fusion-core-components/lib/components/Icon/Icon';
import Button from 'fusion-core-components/lib/components/Button/Button';
import ModalBox from 'fusion-core-components/lib/components/ModalBox/ModalBox';
import styles from './NewCaseConfirmation.css';

const cx = classNames.bind(styles);


export class NewCaseConfirmation extends Component {
    static defaultProps = {
        newCaseInfo: {},
        actions: {},
    };

    static propTypes = {
        newCaseInfo: PropTypes.objectOf(PropTypes.object).isRequired,
    }

    constructor() {
        super();

        this.state = {};
    }

    closeModal = () => {
        browserHistory.goBack();
    }
    renderModalContent = () => {
        const { newCaseInfo } = this.props;
        const { id } = newCaseInfo;
        const viewCaseDetailLink = `/case/${id}`;
        const { name, caseType } = (newCaseInfo.department) || {};
        const { type } = caseType || {};
        const { priority, description, orderNumber = 'None', error } = newCaseInfo;
        const caseInfoAddress = (newCaseInfo && newCaseInfo.contacts) ? newCaseInfo.contacts : '';
        const caseAddress = caseInfoAddress && caseInfoAddress.map(item => <p className={cx('xl6', 'lg6', 'md6', 'sm6')}>
            <p className={cx('confirmationLabel')}>{(item.type) === 'registered' || (item.type) === 'guest' ? 'Customer Contact' : ''}{((item.type) === 'caller') ? 'Caller Contact' : ''}</p>
            <p className={cx('caseDescription')} data-automation-id="address-details">
                {item.firstName} {item.lastName} {item.lastName ? <br /> : ''}
                {item.address1} {item.address1 ? <br /> : ''}
                {item.city}{item.city ? ',' : ''} {item.state} {item.zipCode} {item.zipCode ? <br /> : ''}
            </p>
            <br />
        </p>);
        return (
            <div className={cx('newCaseConfirmationContent')}>
                <div className={cx('successIcon')}>
                    <Link to="/case/list">
                        <Icon iconType="svg" viewBox="0 0 24 24" width="48px" height="48px" name="success" pathClassName={cx('rightIcon')} />
                    </Link>
                </div>
                {!error ?
                    (<div>
                        <div className={cx('confirmationTitle')}>Case Created</div>
                        <div className={cx('confirmationCaseId')}>{id}</div>

                        <div className={cx('confirmationBody')}>

                            <div className={cx('xl6', 'lg6', 'md6', 'sm12')}>
                                <p className={cx('confirmationLabel')}>Case Type</p>
                                <p className={cx('confirmationLabelTxt')} data-automation-id="case-type">{type}</p>
                            </div>
                            <div className={cx('xl6', 'lg6', 'md6', 'sm12')}>
                                <p className={cx('confirmationLabel')}>Department</p>
                                <p className={cx('confirmationLabelTxt')} data-automation-id="department">{name}</p>
                            </div>

                            <div className={cx('xl6', 'lg6', 'md6', 'sm12')}>
                                <p className={cx('confirmationLabel')}>Priority</p>
                                <p className={cx('confirmationLabelTxt')} data-automation-id="priority">{priority}</p>
                            </div>
                            <div className={cx('xl6', 'lg6', 'md6', 'sm12')}>
                                <p className={cx('confirmationLabel')}>Order Number</p>
                                <p className={cx('confirmationLabelTxt')} data-automation-id="order">{orderNumber}</p>
                            </div>

                            <div className={cx('xl12', 'lg12', 'md12', 'sm12')}>
                                <p className={cx('confirmationLabel')}>Description</p>
                                <p className={cx('confirmationLabelTxt')} data-automation-id="description">{description}</p>
                            </div>

                            <div className={cx('xl12', 'lg12', 'md12', 'sm12', 'confirmationAddBlk')}>
                                <p className={cx('confirmationLabelTxt')} data-automation-id="contacts">
                                    {caseAddress}
                                </p>
                            </div>

                            <div className={cx('xl6', 'lg6', 'md6', 'sm12')}>
                                <Link to={viewCaseDetailLink}>
                                    <Button data-automation-id="new-case-confirmation-button" buttonType="Tertiary" type="button" size="Xl" className={cx('viewBtn')}>View Case Details</Button>
                                </Link>
                            </div>
                            <div className={cx('xl6', 'lg6', 'md6', 'sm12')}>
                                <Button data-automation-id="close-btn" buttonType="Tertiary" type="button" size="Xl" className={cx('okBtn')} onClick={this.closeModal}>OK</Button>
                            </div>

                        </div>
                    </div>) :
                    (
                        <h1>{error}</h1>
                    )}
            </div>

        );
    }

    render() {
        const { newCaseInfo } = this.props;
        const { showConfirmModal } = newCaseInfo;
        return (
            <div className={cx('newCaseConfirmationModal')}>
                <ModalBox
                    showModal={showConfirmModal}
                    onClose={this.closeModal}
                    defaultHeader
                    modalContentTheme={cx('modalContentWrapper')}
                    modalTitleTheme={cx('modalTitle')}
                    modalTheme={cx('storesTablet')}
                    modalBlockTheme={cx('pdpCustomModalBlock')}
                    >
                    {this.renderModalContent()}
                </ModalBox>

            </div>
        );
    }

}
export default NewCaseConfirmation;
