import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import moment from 'moment';
import SearchFilterConnect, { SearchFilter } from './SearchFilter';


const mockprop = {
    toggleFilterBox: sinon.spy(),
    startDateFormated: '',
    endDateFormated: '',
    inputData: {
        searchText: 'test@contractor.jcp.com',
        startDate: moment(),
        endDate: moment('02/22/18'),
        searchType: 'contact.email',
        isLoading: false,
        emptySearch: false,
        expanded: false,
    },

};

describe('Test suits for <SearchFilter />', () => {
    const mockStore = configureStore([]);
    const store = mockStore({
        context: {
            deviceType: { isDeskTop: true },
        },
        filterResults: {
            filterResults: {
                caseTypeList: [
                    { id: '1', name: '24HR Cancel', count: '10' },
                    { id: '1', count: '10' },
                    { id: '11', name: 'Hand Pick' },
                ],
                priorityList: [
                    { id: '1', name: 'Low', count: '110' },
                    { id: '1', count: '110' },
                    { id: '2', name: 'Medium' },
                ],
                statusList: [
                    { id: '0:2', name: 'Active', count: '199' },
                    { id: '0:2', count: '199' },
                    { id: '0:3', name: 'Active' },
                ],
            },
            selectedFilterResults: [],
        },
    });
    let wrapper;
    beforeEach(() => {
        wrapper = mount(
            <Provider store={store}>
                <SearchFilterConnect
                    toggleFilterBox={mockprop.toggleFilterBox}
                    inputData={mockprop.inputData}/>
            </Provider>,
        );
    });

    it('should load the SearchFilter component', () => {
        expect(wrapper).to.exist;
        expect(wrapper).to.have.length(1);
    });

    it('should trigger the searchHandler metohd oncliking of the search button', () => {
        const onGetFilterItemsRequest = sinon.spy();
        const onMaintainFilterItemRequest = sinon.spy();
        const onGetcaseSearchListing = sinon.spy();
        wrapper = shallow(
            <SearchFilter
                actions={{
                    getFilterItemsRequest: onGetFilterItemsRequest,
                    maintainFilterItemRequest: onMaintainFilterItemRequest,
                    getcaseSearchListing: onGetcaseSearchListing,
                }}
                toggleFilterBox={mockprop.toggleFilterBox}
                inputData={mockprop.inputData} />);
        const instance = wrapper.instance();
        wrapper.setState({
            filters: [
                { name: '24HR Cancel', id: '1', resource: 'type' },
                { name: '24HR Cancel', id: '1', resource: 'priority' },
                { name: '24HR Cancel', id: '1', resource: 'status' },
                { name: '24HR Cancel', id: '1', resource: 'no' },
            ],
        });
        instance.filterSubmit();
    });
});

describe('Test suits for <SearchFilter /> without props', () => {
    const mockStore = configureStore([]);
    const store = mockStore({
        context: {
            deviceType: { isDeskTop: true },
        },
        filterResults: {
            filterResults: {},
            selectedFilterResults: [],
        },
    });
    let wrapper;
    beforeEach(() => {
        wrapper = mount(
            <Provider store={store}>
                <SearchFilterConnect/>
            </Provider>,
        );
    });

    it('should load the SearchFilter component', () => {
        expect(wrapper).to.exist;
        expect(wrapper).to.have.length(1);
    });
});

describe(' with state props', () => {
    const onGetFilterItemsRequest = sinon.spy();
    const onMaintainFilterItemRequest = sinon.spy();
    const onGetcaseSearchListing = sinon.spy();
    const checkWrapper = shallow(
        <SearchFilter
            actions={{
                getFilterItemsRequest: onGetFilterItemsRequest,
                maintainFilterItemRequest: onMaintainFilterItemRequest,
                getcaseSearchListing: onGetcaseSearchListing,
            }}
            toggleFilterBox={mockprop.toggleFilterBox}
            inputData={mockprop.inputData} />,
    );

    it('click on checkbox', () => {
        checkWrapper.setState({ filters: [] });
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
        expect(checkWrapper.instance().showValue(true, '24HR Cancel', '1', 'type')).to.be.called;
        checkWrapper.find('.filterCheckbox').at(0).simulate('click', { target: { checked: false } });
        expect(checkWrapper.instance().showValue(false, '24HR Cancel', '1', 'type')).to.be.called;
        expect(checkWrapper.instance().showValue(undefined, '24HR Cancel', '1', 'type')).to.be.called;

        checkWrapper.find('.filterCheckbox').at(1).simulate('click', { target: { checked: true } });
        expect(checkWrapper.instance().showValue(true, '24HR Cancel', '1', 'priority')).to.be.called;
        checkWrapper.find('.filterCheckbox').at(1).simulate('click', { target: { checked: false } });
        expect(checkWrapper.instance().showValue(false, '24HR Cancel', '1', 'priority')).to.be.called;

        checkWrapper.find('.filterCheckbox').at(2).simulate('click', { target: { checked: true } });
        expect(checkWrapper.instance().showValue(true, '24HR Cancel', '1', 'status')).to.be.called;
        checkWrapper.find('.filterCheckbox').at(2).simulate('click', { target: { checked: false } });
        expect(checkWrapper.instance().showValue(false, '24HR Cancel', '1', 'status')).to.be.called;
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
        checkWrapper.unmount();
    });
});
