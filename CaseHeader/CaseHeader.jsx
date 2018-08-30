import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _map from 'lodash/map';
import _get from 'lodash/get';
import { Link, browserHistory } from 'react-router';
import Button from 'fusion-core-components/lib/components/Button/Button';
import Icon from 'fusion-core-components/lib/components/Icon/Icon';
import styles from './CaseHeader.css';
import Notification from '../Notification/Notification';

const cx = classNames.bind(styles);

export class CaseHeader extends Component {

    static defaultProps = {
        refresh: [],
        notifications: {},
        action: {},
        preferences: {},
    }

    static propTypes = {
        refresh: PropTypes.objectOf(PropTypes.func),
        notifications: PropTypes.objectOf(PropTypes.object),
        action: PropTypes.objectOf(PropTypes.func),
        preferences: PropTypes.objectOf(PropTypes.object),
    }
    constructor() {
        super();
        this.state = {
            expandedAlert: false,
        };
    }
    /* istanbul ignore next */
    componentWillMount() {
        const { notifications } = this.props;
        const { data } = notifications;
        if (!data) {
            this.props.action.getNotificationList({ agentId: _get(this.props.preferences, 'agentId') });
        }
    }
    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, false);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, false);
    }
    handleClickOutside = (e) => {
        /* istanbul ignore else if */
        if ((this.alertNode && !this.alertNode.contains(e.target))
        && (this.notificationNode && !this.notificationNode.contains(e.target))) {
            this.toggleNotificationBox();
        }
    }
    backToSearch = () => {
        this.props.action.caseSearchEmptyRequest();
        browserHistory.push('/case/search');
    }
    newCase = () => {
        browserHistory.push('/case/add');
    }
    toggleNotificationBox = () => {
        this.setState({
            expandedAlert: !this.state.expandedAlert,
        });
        this.props.action.postNotificationsSuccess();
    }
    render () {
        const { expandedAlert } = this.state;
        const { notifications } = this.props;
        const unreadNotificationsCount = _map(notifications.data, 'is_read_already');
        return (
            <div>
                <div className={cx('myCaseNotification')}>
                    <ul className={cx('caseNotification')}>
                        <li>
                            <a href="javascript:void(0);" onClick={this.backToSearch} data-automation-id="case-header-search-button">
                                <Icon iconType="svg" classNames="icon" viewBox="0 0 32 32" width="32px" height="32px" data-automation-id="case-header-search-icon" name="search-case" pathClassName={cx('rightIcon')}/>
                                <span className={cx('notificationText')}>Search</span>
                            </a>
                        </li>
                        <li ref={(node) => { this.alertNode = node; }}>
                            <a className={cx('notification')} href="javascript:void(0);" data-automation-id="case-header-notification-button" onClick={this.toggleNotificationBox}>
                                <Icon iconType="svg" data-automation-id="case-header-notification-icon" classNames="icon" viewBox="0 0 32 32" width="32px" height="32px" name="alert" pathClassName={cx('rightIcon', 'Notification')}/>
                                <span className={cx('notificationText')}>Alerts</span>
                                {
                                  unreadNotificationsCount.length > 0 ?
                                      <span className={cx('notification')} data-automation-id="case-header-notification-count">{unreadNotificationsCount.length}</span>
                                       : null
                                }
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);" data-automation-id="case-header-refresh-button" onClick={this.props.refresh}>
                                <Icon iconType="svg" classNames="icon" viewBox="0 0 32 32" width="32px" height="32px" name="refresh" pathClassName={cx('rightIcon')}/>
                                <span className={cx('notificationText')}>Refresh</span>
                            </a>
                        </li>
                    </ul>
                    { expandedAlert ? <div ref={(node) => { this.notificationNode = node; }}><Notification
                        action={this.props.action}
                        cases={notifications.data}/> </div> : null }
                </div>
                <Link to="">
                    <Button data-automation-id="case-header-new-case-button" buttonType="Tertiary" type="button" size="xl" className={cx('newCaseBtn')} onClick={this.newCase}>New Case</Button>
                </Link>
            </div>
        );
    }
}

const mapStateToProps = store => ({
    preferences: store.context.preferences,

});
export default connect(mapStateToProps)(CaseHeader);
