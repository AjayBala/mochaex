import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames/bind';
import CheckBox from 'fusion-core-components/lib/components/CheckBox/CheckBox';
import { connect } from 'react-redux';
import _findIndex from 'lodash/findIndex';
import _values from 'lodash/values';
import { bindActionCreators } from 'redux';
import { messagesActions } from 'yoda-fusion-site-components/lib/components/Messages';
import * as caseDetailsActions from '../../actions/CaseDetailsAction';
import * as caseSearchActions from '../../actions/CaseSearchAction';
import styles from './CaseDetailsFilter.css';

const cx = classNames.bind(styles);

export class CaseDetailsFilter extends Component {

    static defaultProps = {
        toggleFilterBox: null,
        actions: null,
        selectedFilter: {},
        preferences: {},
    }

    static propTypes = {
        actions: PropTypes.objectOf(PropTypes.func),
        selectedFilter: PropTypes.Object,
        preferences: PropTypes.Object,
        toggleFilterBox: PropTypes.func,
    }

    constructor() {
        super();
        this.state = {
            filters: [],
        };
    }
    componentWillMount() {
        const { selectedFilter } = this.props;
        this.setState({
            filters: selectedFilter,
        });
        document.addEventListener('click', this.handleClick, false);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false);
    }
    handleClick = (e) => {
        if (!this.node.contains(e.target)) {
            this.props.toggleFilterBox();
        }
    }
    showValue = (status, item) => {
        if (status === true) {
            const filterArray = this.state.filters;
            filterArray.push(item);
            this.setState({
                filters: filterArray,
            });
        } else if (status === false) {
            const filter = this.state.filters;
            const removeElement = _findIndex(filter, item);
            filter.splice(removeElement, 1);
            this.setState({ filters: filter });
        }
        this.props.actions.updateCaseDetailsFilter(this.state.filters);
    }
    render() {
        const { selectedFilter, preferences } = this.props;
        const filterArr = _values(selectedFilter);
        const typeFilter = preferences.caseDetailsFilter.map((item) => {
            const checkBoxType = [];
            const indexVal = _findIndex(filterArr, { name: item.name });
            let checkStatus = true;
            if (indexVal === -1) {
                checkStatus = false;
            }
            checkBoxType.push(<div key={item.id} >
                <CheckBox className={cx('filterCheckbox')} data-automation-id="filter-checkbox" config={{ defaultChecked: checkStatus, id: `type_${item.id}`, name: item.name }} label={<span className={cx('filterLabel')}>{item.name}</span>} onClick={e => this.showValue(e.target.checked, item)} checked="checked" />
            </div>);
            return checkBoxType;
        });
        return (
            <div ref={(node) => { this.node = node; }}>
                <div className={cx('filterContent')}>
                    <div className={cx('checkBoxText', 'accordianCheckbox', 'filterByType')}>
                        <h1>By Activities</h1>
                        {typeFilter}
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = store => ({
    selectedFilter: store.caseDetailsData.caseDetailsData.caseDetailsFilter || [],
    preferences: store.context.preferences,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign(messagesActions, caseDetailsActions, caseSearchActions), dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(CaseDetailsFilter);
