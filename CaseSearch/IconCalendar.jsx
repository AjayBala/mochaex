import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames/bind';
import Icon from 'fusion-core-components/lib/components/Icon/Icon';
import styles from './CaseSearch.css';

const cx = classNames.bind(styles);

const IconCalendar = props => (
    <button onClick={props.onClick} >
        <Icon iconType="svg" classNames="icon" viewBox="0 0 32 32" width="32px" height="32px" automationId="collapse-right" name="date" pathClassName={cx('rightIcon')} />
    </button>
    );

IconCalendar.propTypes = {
    onClick: PropTypes.func,
};

IconCalendar.defaultProps = {
    onClick: [],
};

export default IconCalendar;
