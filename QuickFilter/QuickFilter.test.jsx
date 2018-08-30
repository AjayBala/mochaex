import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { QuickFilter } from './QuickFilter';

describe('Test suits for <Quick filter />', () => {
    const selectedFilters = {
        quickFilter: {
            department: 'Automated Case',
        },
    };
    const departmentList = [
        {
            id: '1',
            name: 'AP',
            displayKey: 'AP',
            value: 'AP',
        },
        {
            id: '2',
            name: 'Automated Case',
            displayKey: 'Automated Case',
            value: 'Automated CaseAP',
        },
    ];
    const caseList = {
        quickFilterCaseCount: [
            { key: 'X-EXPIRE-TMRW-COUNT', displayValue: 'Expire Tmrw', paramKey: 'case.expiry', value: 1, count: 1 },
            { key: 'X-EXPIRE-TODAY-COUNT', displayValue: 'Expire Today', paramKey: 'case.expiry', value: 0, count: 0 },
            { key: 'X-EXTENDED-COUNT', displayValue: 'Extended', paramKey: 'case.extension', value: 1, count: 1 },
        ],
    };
    const defaultProps = {
        caseList: {},
        departmentList: [],
        quickFilterDidChange: () => {},
        selectedFilter: {},
    };
    const brickFilterOptions = null;
    const wrapper = shallow(<QuickFilter
        brickFilterOptions={brickFilterOptions}
        selectedFilter={selectedFilters}
        departmentList={departmentList}
        caseList={caseList}
        />);
    const instance = wrapper.instance();
    it('Check if the werapper component exist ', () => {
        expect(wrapper).to.exist;
    });
    it('Should be called quickFilterToggle with valid params ', () => {
        wrapper.instance().quickFilterToggle('');
    });
    it('Should be called quickFilterToggle without params', () => {
        wrapper.instance().quickFilterToggle('Expire Tmrw');
    });
    const wrapper1 = shallow(<QuickFilter {...defaultProps} />);
    it('Check if the werapper component exist ', () => {
        expect(wrapper1).to.exist;
    });
    it('Should be called quickFilterList ', () => {
        wrapper.instance().quickFilterList();
    });
    const quickFilterDidChange = sinon.spy();
    it('onchange dropdown', () => {
        const newmount = mount(<Provider store={configureStore([])({})}>
            <QuickFilter
                caseList={caseList}
                brickFilterOptions={caseList}
                selectedFilter={selectedFilters}
                departmentList={departmentList}
                onChange={instance.dropdownDidChange('AP')}
            /></Provider>);
        newmount.find('YodaDropdown').props().onChange('AP');
        newmount.find('a').at(0).props().onClick('Expire Today');
        newmount.find('a').at(1).props().onClick('Expire Tmrw');
        newmount.find('a').at(2).props().onClick('Extended');
        expect(newmount).to.exist;
        expect(quickFilterDidChange).to.be.called;
    });
    it('Componentwillreceiveprops with empty advance filter', () => {
        const quickFilterWrapper = new QuickFilter();
        const nextProps = {
            selectedFilter: {
                department: 'All department',
            },
        };
        quickFilterWrapper.componentWillReceiveProps(nextProps);
        quickFilterWrapper.componentWillReceiveProps({});
    });
});
