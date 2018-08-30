import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import AdvanceFilterConnect, { AdvanceFilter } from './AdvanceFilter';

describe('Test suits for <AdvanceFilter filter />', () => {
    const selectedFilter = {
        AdvanceFilter: {
        },
    };
    const caseFilter = {
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
    const wrapper = mount(
        <Provider store={caseFilter}>
            <AdvanceFilterConnect />
        </Provider>,
    );
    const defaultProps = {
        toggleAdvanceFilter: () => { },
    };
    const checkWrapper = shallow(<AdvanceFilter
        selectedFilter={selectedFilter}
        caseFilter={caseFilter}
        {...defaultProps}/>);
    it('should apply filter called', () => {
        const instance = checkWrapper.instance();
        instance.applyFilter();
        instance.updateFilterSelection(true, caseFilter.name, caseFilter.id, 'status');
        instance.updateFilterSelection(false, caseFilter.name, caseFilter.id, 'status');
    });

    it('click on checkbox', () => {
        checkWrapper.setProps({
            caseFilter: {
                caseTypeList: [
                    { id: '1', name: '24HR Cancel', count: '10' },
                ],
                priorityList: [
                    { id: '1', name: 'Low', count: '110' },
                ],
                statusList: [
                    { id: '0:2', name: 'Active', count: '199' },
                ],
            },
            selectedFilter: [
                { id: '0:2', name: 'Active', count: '199' },
                { id: '1', name: 'Low', count: '110' },
                { id: '1', name: '24HR Cancel', count: '10' },
            ],
        });
        checkWrapper.find('.filterCheckbox').at(0).simulate('click', { target: { checked: true } });
        expect(checkWrapper.instance().updateFilterSelection(true, '24HR Cancel', '1', 'type')).to.be.called;
        checkWrapper.find('.filterCheckbox').at(0).simulate('click', { target: { checked: false } });
        expect(checkWrapper.instance().updateFilterSelection(false, '24HR Cancel', '1', 'type')).to.be.called;
        expect(checkWrapper.instance().updateFilterSelection(undefined, '24HR Cancel', '1', 'type')).to.be.called;

        checkWrapper.find('.filterCheckbox').at(1).simulate('click', { target: { checked: true } });
        expect(checkWrapper.instance().updateFilterSelection(true, '24HR Cancel', '1', 'priority')).to.be.called;
        checkWrapper.find('.filterCheckbox').at(1).simulate('click', { target: { checked: false } });
        expect(checkWrapper.instance().updateFilterSelection(false, '24HR Cancel', '1', 'priority')).to.be.called;

        checkWrapper.find('.filterCheckbox').at(2).simulate('click', { target: { checked: true } });
        expect(checkWrapper.instance().updateFilterSelection(true, '24HR Cancel', '1', 'status')).to.be.called;
        checkWrapper.find('.filterCheckbox').at(2).simulate('click', { target: { checked: false } });
        expect(checkWrapper.instance().updateFilterSelection(false, '24HR Cancel', '1', 'status')).to.be.called;
    });
    it(' triggers addEventListener', () => {
        const instance1 = checkWrapper.instance();
        instance1.node = {
            contains: () => true,
        };
        const e = { target: {
        } };
        checkWrapper.instance().handleClick(e);
    });
    it('triggers removeEventListener', () => {
        const instance1 = checkWrapper.instance();
        instance1.node = {
            contains: () => false,
        };
        const e = { target: {
        } };
        checkWrapper.instance().handleClick(e);
    });
    it('will test something after being mounted', () => {
        wrapper.unmount();
    });
});
