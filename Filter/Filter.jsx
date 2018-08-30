
import classNames from 'classnames/bind';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'fusion-core-components/lib/components/Icon/Icon';
import _get from 'lodash/get';
import _values from 'lodash/values';
import _findIndex from 'lodash/findIndex';
import _isEmpty from 'lodash/isEmpty';
import QuickFilter from '../QuickFilter/QuickFilter';
import AdvanceFilter from '../AdvanceFilter/AdvanceFilter';
import styles from './Filter.css';

const cx = classNames.bind(styles);

export class Filter extends Component {
    static propTypes = {
        caseCount: PropTypes.oneOfType(PropTypes.number),
        brickFilterOptions: PropTypes.objectOf(PropTypes.object),
        departmentList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
        filterOptions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
        onFilterChange: PropTypes.oneOfType(PropTypes.func),
    };

    static defaultProps = {
        caseCount: 0,
        brickFilterOptions: {},
        departmentList: [],
        filterOptions: {},
        onFilterChange: () => { },
    };

    constructor() {
        super();
        this.state = {
            expandAdvanceFilter: false,
        };
        this.selectedItems = {
            quickFilter: {},
            advanceFilter: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!_isEmpty(nextProps.filterOptions, 'advanceSelectedItems')) {
            this.selectedItems.advanceFilter = nextProps.filterOptions.advanceSelectedItems;
            this.selectedItems.quickFilter = nextProps.filterOptions.department;
            this.selectedItems.SelectedBrick = nextProps.filterOptions.SelectedBrick;
        }
    }

    onQuickFilterChange = (selectedFilter) => {
        this.selectedItems.quickFilter = selectedFilter;
        this.props.onFilterChange(this.selectedItems);
    }
    advanceFilterSubmit = (selectedFilter) => {
        this.toggleAdvanceFilter();
        this.selectedItems.advanceFilter = selectedFilter;
        this.props.onFilterChange(this.selectedItems);
    }

    toggleAdvanceFilter = () => {
        this.setState({
            expandAdvanceFilter: !this.state.expandAdvanceFilter,
        });
    }

    clearAdvanceFilter = () => {
        this.state.expandAdvanceFilter ? this.setState({ expandAdvanceFilter: false }) : '';
        this.selectedItems.advanceFilter = [];
        this.props.onFilterChange(this.selectedItems);
    }

    removeFilter = (item) => {
        this.state.expandAdvanceFilter ? this.setState({ expandAdvanceFilter: false }) : '';
        const filterItem = { name: item.name, id: item.id, resource: item.resource };
        const index = _findIndex(this.selectedItems.advanceFilter, filterItem);
        this.selectedItems.advanceFilter.splice(index, 1);
        this.props.onFilterChange(this.selectedItems);
    }

    addDisplayKey = (dataSource, key) => {
        dataSource.filter((item) => {
            item.displayKey = item[key];
            item.value = item[key];
            return true;
        });
    }

    renderFilterBricks = () => {
        const filterArr = _values(this.selectedItems.advanceFilter);
        const renderItems = filterArr && filterArr.map((item) => {
            const filterload = [];
            filterload.push(<button key={item.id} className={cx('filterLabel')}>
                <span className={cx('lableText')}>{item.name}</span>
                <span className={cx('lableClose')}>
                    <a href="javascript:void(0);" onClick={() => this.removeFilter(item)}>
                        <Icon
                            iconType="svg" classNames="icon" viewBox="0 0 24 24" width="32px" height="32px"
                            automationId="collapse-right" name="close" pathClassName={cx('rightIcon')} />
                    </a>
                </span>
            </button>);
            return filterload;
        });
        return renderItems;
    }

    render() {
        const { caseCount, departmentList, filterOptions, brickFilterOptions } = this.props;
        this.addDisplayKey(departmentList, 'name');
        const { advanceFilterOptions, advanceSelectedItems, quickFilterOptions } = filterOptions;
        return (
            <div>
                <QuickFilter
                    brickFilterOptions={brickFilterOptions}
                    departmentList={departmentList}
                    selectedFilter={quickFilterOptions}
                    quickFilterDidChange={this.onQuickFilterChange} />

                <div className={cx('filterContainer')}>
                    <div className={cx('titleContainer', 'xl11', 'lg11', 'md11')}>
                        <div data-automation-id="case-count" className={cx('title', 'float-left')}>{caseCount} Cases</div>
                        {this.renderFilterBricks()}
                        {
                            _get(this.selectedItems, 'advanceFilter.length') >= 2 ?
                                <div className={cx('clearFilter')}>
                                    <a href="javascript:void(0);" onClick={this.clearAdvanceFilter}>Clear Filter</a>
                                </div> : null
                        }
                    </div>

                    <div className={cx('filterTxt', 'xl1', 'lg1', 'md1', 'sm6')}>
                        <a href="javascript:void(0);" onClick={this.toggleAdvanceFilter}>Filter</a>
                        {this.state.expandAdvanceFilter &&
                            <AdvanceFilter
                                caseFilter={advanceFilterOptions}
                                selectedFilter={advanceSelectedItems}
                                onSubmit={this.advanceFilterSubmit}
                                toggleAdvanceFilter={this.toggleAdvanceFilter}/>}
                    </div>
                </div>
            </div>
        );
    }
}

export default Filter;
