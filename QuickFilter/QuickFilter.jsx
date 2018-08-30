import classNames from 'classnames/bind';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import YodaDropdown from 'yoda-fusion-site-components/lib/components/YodaDropdown/YodaDropdown';
import styles from './QuickFilter.css';

const cx = classNames.bind(styles);

export class QuickFilter extends Component {
    static propTypes = {
        departmentList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
        quickFilterDidChange: PropTypes.oneOfType(PropTypes.func),
        selectedFilter: PropTypes.oneOfType(PropTypes.object),
        brickFilterOptions: PropTypes.objectOf(PropTypes.object),
    };

    static defaultProps = {
        departmentList: [],
        brickFilterOptions: {},
        quickFilterDidChange: () => { },
        selectedFilter: {},
    };

    constructor() {
        super();
        this.state = {
            SelectedBrick: '',
        };
        this.selectedFilters = {};
    }
    componentWillReceiveProps(nextProps) {
        if (!_isEmpty(nextProps.selectedFilter, 'department')) {
            this.selectedFilters.department = nextProps.selectedFilter.department;
        }
    }
    dropdownDidChange = (value) => {
        this.selectedFilters.department = value;
        this.props.quickFilterDidChange(this.selectedFilters);
    }
    quickFilterToggle = (value) => {
        if (this.state.SelectedBrick !== value) {
            this.selectedFilters.quickFilterSelected = value;
            this.props.quickFilterDidChange(this.selectedFilters);
            this.setState({
                SelectedBrick: this.selectedFilters.quickFilterSelected,
            });
        } else {
            this.selectedFilters.quickFilterSelected = '';
            this.props.quickFilterDidChange(this.selectedFilters);
            this.setState({ SelectedBrick: '' });
        }
    }
    quickFilterList = () => {
        const { brickFilterOptions, selectedFilter } = this.props;

        const { quickFilterCaseCount } = brickFilterOptions || {};
        return (quickFilterCaseCount || []).map((item, index) => <li keys={index} className={cx((index === 0) ? 'first' : '', ((selectedFilter.SelectedBrick || this.state.SelectedBrick) === item.displayValue) ? 'active' : '')}>
            <a
                href="javascript:void(0);" role="button" className={cx('statusData')}
                onClick={() => this.quickFilterToggle(item.displayValue)}>{item.displayValue}<span className={cx('statusNumber')}>({item.count ? item.count : 0})</span></a>
        </li>);
    }
    render() {
        const { departmentList, selectedFilter } = this.props;
        return (
            <div>
                <div className={cx('subMenu')}>
                    <div className={cx('xl4', 'lg4', 'md4', 'sm4')}>
                        <div className={cx('group')}>
                            <label htmlFor="Suffix" />
                            <YodaDropdown
                                dataSource={departmentList} data-automation-id="action-list-dropdown"
                                defaultValue={_isEmpty(selectedFilter.department) ? 'All Departments' : selectedFilter.department}
                                mobileTheme={cx('dropdown')}
                                theme={cx('wrapper')}
                                optionsTheme={cx('optionsTheme')}
                                dropdownTheme={cx('dropdownTheme')}
                                labelTheme={cx('defaultDisplay')}
                                toolTip={cx('tooltip')}
                                tooltipWrapper={cx('tooltipWrapper')}
                                toolContent={cx('toolContent')}
                                onChange={this.dropdownDidChange}
                            />
                        </div>
                    </div>
                    <div className={cx('xl8', 'lg8', 'md8', 'sm8')}>
                        <div className={cx('box')}>
                            <ul className={cx('boxFilter')}>
                                {this.quickFilterList()}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuickFilter;
