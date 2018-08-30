import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { Filter } from './Filter';
import { commonDetails } from '../../../test/mock/common.json';

describe('Test suits for <Filter />', () => {
    const caseCount = 20;
    const filterOptions = {
        statusList: [
            {
                id: '0',
                name: 'Open',

            },
            {
                id: '6',
                name: 'Archived',
            },
        ],
        caseTypeList: [
            {
                id: '30',
                name: 'X Non CCC Claims REN',
            },
            {
                id: '31',
                name: 'X Non CCC CR Follow Up',
            },
        ],
        priorityList: [
            {
                id: '3',
                name: 'High',
            },
            {
                id: '2',
                name: 'Medium',
            },
            {
                id: '1',
                name: 'Low',
            },
        ],
    };
    const defaultProps = {
        caseCount: 0,
        brickFilterOptions: {},
        departmentList: [],
        filterOptions: {},
        onFilterChange: () => {},
    };
    const wrapper1 = shallow(<Filter {...defaultProps} />);
    it('Check if the wrapper component exist ', () => {
        expect(wrapper1).to.exist;
    });
    const onFilterChange = sinon.spy();
    it('should apply filter called', () => {
        const wrapper = shallow(<Filter
            caseCount={caseCount}
            departmentList={commonDetails.departmentList}
            filterOptions={filterOptions} />);
        const instance = wrapper.instance();
        instance.setState({ expandAdvanceFilter: false });
        instance.selectedItems = {
            advanceFilter: [
                {
                    name: '24HR Cancel', id: '1', resource: 'type',
                },
                {
                    name: 'Cancel', id: '2', resource: 'status',
                },
                {
                    name: 'success', id: '3', resource: 'priority',
                },
            ],
        };
        instance.render();
        wrapper.find('.filterTxt a').at(0).simulate('click');
        wrapper.find('.lableClose a').at(0).simulate('click', instance.removeFilter({ name: '24HR Cancel', id: '1', resource: 'type' }));
        expect(wrapper.instance().state.expandAdvanceFilter).to.equal(false);
        wrapper.instance().state.expandAdvanceFilter = true;
        wrapper.find('.filterLabel').at(0).simulate('click');
        expect(instance.removeFilter({ name: '24HR Cancel', id: '1', resource: 'type' })).to.be.called;
        expect(instance.removeFilter({ name: '', id: '', resource: '' })).to.be.called;
        wrapper.find('.clearFilter a').at(0).simulate('click');
        expect(instance.clearAdvanceFilter()).to.be.called;
        wrapper.instance().state.expandAdvanceFilter = true;
        instance.renderFilterBricks();
        instance.clearAdvanceFilter();
        instance.advanceFilterSubmit();
        instance.onQuickFilterChange();
        expect(onFilterChange).to.be.called;
    });
    it('Componentwillreceiveprops with empty advance filter', () => {
        const FilterWrapper = new Filter();
        const nextProps = {
            filterOptions: {
                advanceSelectedItems: [],
                department: 'All Departments',
            },
        };
        FilterWrapper.componentWillReceiveProps(nextProps);
        FilterWrapper.componentWillReceiveProps({});
    });
});

