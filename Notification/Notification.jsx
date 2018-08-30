import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames/bind';
import styles from './Notification.css';
import { getDateForTimestamp } from '../../common/Util';

const cx = classNames.bind(styles);

export class Notification extends Component {

    static defaultProps = {
        cases: [],
        action: {},
    }

    static propTypes = {
        cases: PropTypes.objectOf(PropTypes.array),
        action: PropTypes.objectOf(PropTypes.func),
    }
    constructor() {
        super();
        this.state = {
        };
    }
    handleNotification = (e, noteId, type, caseId, id) => {
        e.preventDefault();
        e.stopPropagation();
        const paramId = id.split('/');
        if (type === 2) {
            const notificationCaseId = {
                id: noteId, agentId: paramId[4],
            };
            this.props.action.removeSelectedNotification(notificationCaseId);
            this.props.action.getCaseDetails(caseId);
            const urlPage = `/case/${caseId}`;
            browserHistory.push(urlPage);
        }
    }
    casesDetail = () => {
        const { cases } = this.props;
        return ((cases || []).map((casesObject) => {
            const labelText = (casesObject.type === 1) ? 'Expiring today' : 'Added to your que';
            return (<li className={cx('link')}>
                <span className={cx((casesObject.type === 1) ? 'alertLabelRed' : 'alertLabel')}>{labelText}
                    <a
                        href="javascript:void(0);" className={cx('notification')} onClick={e => this.handleNotification(e, casesObject.id, casesObject.type, casesObject.caseInfo.id, casesObject.href)}
                        >{casesObject.caseInfo.id}</a>
                </span>
                {
                    casesObject.created ?
                        <span className={cx('alertTime')}>{getDateForTimestamp(casesObject.created, 'LT')}</span>
                    : null
                }
            </li>);
        }));
    }
    render () {
        return (
            <div className={cx('alertContent')}>
                <ul className={cx('alert')}>
                    {
                        this.casesDetail()
                    }
                </ul>
            </div>
        );
    }
}

export default Notification;
