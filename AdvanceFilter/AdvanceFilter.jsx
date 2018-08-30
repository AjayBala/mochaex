import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames/bind';
import CheckBox from 'fusion-core-components/lib/components/CheckBox/CheckBox';
import Button from 'fusion-core-components/lib/components/Button/Button';
import _findIndex from 'lodash/findIndex';
import _values from 'lodash/values';
import styles from './AdvanceFilter.css';

const cx = classNames.bind(styles);

export class AdvanceFilter extends Component {

    static defaultProps = {
        onSubmit: () => {},
        caseFilter: {},
        selectedFilter: [],
        toggleAdvanceFilter: null,
    }

    static propTypes = {
        onSubmit: PropTypes.func,
        caseFilter: PropTypes.oneOfType(PropTypes.objectÍ),
        selectedFilter: PropTypes.oneOfType(PropTypes.array),
        toggleAdvanceFilter: PropTypes.func,
    }

    componentWillMount() {
        [...this.selectedFilter] = this.props.selectedFilter || [];
        document.addEventListener('click', this.handleClick, false);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false);
    }
    handleClick = (e) => {
        if (!this.node.contains(e.target)) {
            this.props.toggleAdvanceFilter();
        }
    }

    applyFilter = () => {
        this.props.onSubmit(this.selectedFilter);
    }

    updateFilterSelection = (selectedStatus, name, id, resource) => {
        const filterItem = { name, id, resource };

        selectedStatus ?
            this.selectedFilter.push(filterItem) :
            this.selectedFilter.splice(_findIndex(this.selectedFilter, filterItem), 1);
    }

    render() {
        const { caseFilter, selectedFilter } = this.props;
        const filterArr = _values(selectedFilter);
        const statusFilter = caseFilter && caseFilter.statusList && caseFilter.statusList.map((item) => {
            const checkBoxStatus = [];
            const statusCount = item.count ? item.count : '0';
            const indexVal = _findIndex(filterArr, { name: item.name });
            let checkStatus = true;
            if (indexVal === -1) {
                checkStatus = false;
            }
            checkBoxStatus.push(<div>
                <CheckBox
                    key={item.id}
                    className={cx('filterCheckbox')}
                    config={{ defaultChecked: checkStatus, id: `status_${item.id}`, name: item.name }}
                    label={<span className={cx('filterLabel')}>{item.name} ({statusCount})</span>}
                    onClick={e => this.updateFilterSelection(e.target.checked, item.name, item.id, 'status')}/>
            </div>);
            return checkBoxStatus;
        });
        const priorityFilter = caseFilter && caseFilter.priorityList && caseFilter.priorityList.map((item) => {
            const checkBoxPriority = [];
            const priorityCount = item.count ? item.count : '0';
            const indexVal = _findIndex(filterArr, { name: item.name });
            let checkStatus = true;
            if (indexVal === -1) {
                checkStatus = false;
            }
            checkBoxPriority.push(<div>
                <CheckBox
                    key={item.id}
                    className={cx('filterCheckbox')}
                    config={{ defaultChecked: checkStatus, id: `pri_${item.id}`, name: item.name }}
                    label={<span className={cx('filterLabel')}>{item.name} ({priorityCount})</span>}
                    onClick={e => this.updateFilterSelection(e.target.checked, item.name, item.id, 'priority')} />
            </div>);
            return checkBoxPriority;
        });
        const typeFilter = caseFilter && caseFilter.caseTypeList && caseFilter.caseTypeList.map((item) => {
            const checkBoxType = [];
            const typeCount = item.count ? item.count : '0';
            const indexVal = _findIndex(filterArr, { name: item.name });
            let checkStatus = true;
            if (indexVal === -1) {
                checkStatus = false;
            }
            checkBoxType.push(<div>
                <CheckBox
                    key={item.id}
                    className={cx('filterCheckbox')}
                    config={{ defaultChecked: checkStatus, id: `type_${item.id}`, name: item.name }}
                    label={<span className={cx('filterLabel')}>{item.name} ({typeCount})</span>}
                    onClick={e => this.updateFilterSelection(e.target.checked, item.name, item.id, 'type')}
                    checked="checked" />
            </div>);
            return checkBoxType;
        });
        return (
            <div ref={(node) => { this.node = node; }}>
                <div className={cx('filterContent')}>
                    <div className={cx('checkBoxText', 'accordianCheckbox', 'filterByType')}>
                        <h1>By Type</h1>
                        {typeFilter}
                    </div>
                    <div className={cx('checkBoxText', 'accordianCheckbox', 'filterByStatus')}>
                        <h1>By Status</h1>
                        {statusFilter}
                    </div>
                    <div className={cx('checkBoxText', 'accordianCheckbox', 'filterByPriority')}>
                        <h1>By Priority</h1>
                        {priorityFilter}
                    </div>
                    <div className={cx('filterButtons')}>
                        <Button automationId="test-automation-btn-1" buttonType="Tertiary" type="button" size="xl" className={cx('applyFilterBtn')} onClick={this.applyFilter}>Apply Filter</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdvanceFilter;
