import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CheckBox from 'fusion-core-components/lib/components/CheckBox/CheckBox';
import * as CreateNewCaseActionType from '../../actions/CreateNewCaseAction';
import styles from './CustomerContact.css';

const cx = classNames.bind(styles);

const config = {
    defaultChecked: false,
    name: 'caller contact',
    id: 'caller-contact',
    label: 'Add Caller Contact Information',
};

export class CustomerContact extends Component {
    static defaultProps = {
        contactDetails: {},
        isEditCase: '',
    };

    static propTypes = {
        contactDetails: PropTypes.objectOf(PropTypes.Object).isRequired,
        actions: PropTypes.objectOf(PropTypes.func).isRequired,
        isEditCase: PropTypes.bool,
    };

    constructor() {
        super();
        this.toggleBox = this.toggleBox.bind(this);
    }

    toggleBox(event) {
        this.props.actions.addCallerContact(event.target.checked);
    }

    render() {
        const { contactDetails, isEditCase } = this.props;
        return (
            <div>
                <div className={cx('cusAddress')}>
                    <div className={cx('cusAddTitle')}>Customer Contact</div>
                    <p>{contactDetails.firstName} {contactDetails.lastName}</p>
                    <p>{contactDetails.address1} {contactDetails.address2}</p>
                    <p>{contactDetails.city}, {contactDetails.state} {contactDetails.zipCode}</p>
                </div>
                {(isEditCase) ? '' : <CheckBox config={config} data-automation-id="caller-contact" enableFastClick label="Add Caller Contact Information" onClick={this.toggleBox} id="caller-contact" />}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign(
        CreateNewCaseActionType,
    ), dispatch),
});

export default connect(null, mapDispatchToProps)(CustomerContact);
