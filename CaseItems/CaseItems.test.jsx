import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import _clone from 'lodash/clone';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CaseItemsConnect, { CaseItems } from './CaseItems';
import data from '../CaseSearch/mock.json';
import { commonDetails } from '../../../test/mock/common.json';
import { preferences } from '../../settings.json';

const notifications = {
    count: 3,
    cases: [
        {
            time: '12:00 am',
            id: 'T9123654',
            status: 'Added to your que',
        },
        {
            id: 'T9123654',
            status: 'Expiring today',
        },
        {
            time: '12:00 am',
            id: 'T9123654',
            status: 'Added to your que',

        },
    ],
};

describe('Test suits for <CaseSearch />', () => {
    const mockStore = configureStore([]);
    const store = mockStore({
        context: {
            deviceType: {
                isDeskTop: true,
            },
            preferences: preferences.common,
        },
        caseItems: {
            caseDetailsResponse: {
                cases: [
                    {
                        caseId: 20171220000062,
                        caseType: 'CCR Pending',
                        createdDate: '10-05-17',
                        age: '123 DAYS 2 HOURS ',
                        priority: 'High',
                        caseStatus: 'Open',
                        extensionStatus: '0',
                        releaseDate: '24-12-17',
                        href: '/cases/20171220000062',
                    }],
                count: 120,
            },
            departmentList: commonDetails.departmentList,
        },
    });

    const selectedItems = {
        quickFilter: {
            department: 'Automated Case',
            quickFilterSelected: 'Expire Today',
        },
        advanceFilter: [
            {
                name: '24HR Cancel',
                id: '1',
                resource: 'type',
            },
            {
                name: 'Open',
                id: '0',
                resource: 'status',
            },
            {
                name: 'High',
                id: '3',
                resource: 'priority',
            },
        ],
    };
    let wrapper;
    beforeEach(() => {
        wrapper = mount(
            <Provider store={store}>
                <CaseItemsConnect caseList={_clone(data)} />
            </Provider>,
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });
    it('Check if the werapper component exist ', () => {
        expect(wrapper).to.exist;
    });
    it('case items page API called and UI should render', () => {
        const ongetcaseListing = sinon.spy();
        const ongetNotificationsList = sinon.spy();
        const ongetcaseSearchListing = sinon.spy();
        const ongetConfigOptions = sinon.spy();
        const ongetFilterItemsRequest = sinon.spy();
        const onmaintainFilterItemRequest = sinon.spy();
        const showLoader = sinon.spy();
        const caseRequest = {
            departmentList: commonDetails.departmentList,

        };
        wrapper = shallow(<CaseItems
            preferences={preferences.common}
            caseRequest={caseRequest}
            caseList={_clone(data)}
            actions={{
                getcaseListing: ongetcaseListing,
                getNotificationsList: ongetNotificationsList,
                getcaseSearchListing: ongetcaseSearchListing,
                getConfigOptions: ongetConfigOptions,
                getFilterItemsRequest: ongetFilterItemsRequest,
                maintainFilterItemRequest: onmaintainFilterItemRequest,
                showLoader,
            }}
            context={{
                preferences: preferences.common,
            }}
            notifications={notifications}
            />);
        const instance = wrapper.instance();

        instance.getListing();
        instance.backToSearch();
        instance.generateColumns();
        instance.generateColumns();
        instance.sortCallback();
        instance.switchTab();
        instance.refreshSearch();
        instance.applyFilter(selectedItems);
        instance.state = {
            sortColId: 'caseId',
            sortOrd: 'ASC',
        };
        instance.getNewPage(1);

        wrapper.find('a').at(0).props().onClick();
        wrapper.find('a').at(1).props().onClick();
        wrapper.find('a').at(2).props().onClick();

        expect(wrapper).to.have.length(1);
        selectedItems.advanceFilter[0].resource = '';
        selectedItems.quickFilter.quickFilterSelected = 'Expire Tmrw';
        instance.applyFilter(selectedItems);

        selectedItems.advanceFilter[1].resource = '';
        selectedItems.quickFilter.quickFilterSelected = 'High Priority';
        instance.applyFilter(selectedItems);

        selectedItems.advanceFilter[2].resource = '';
        selectedItems.quickFilter.quickFilterSelected = 'Extended';
        instance.applyFilter(selectedItems);

        selectedItems.advanceFilter[2].resource = '';
        instance.applyFilter(selectedItems);

        selectedItems.advanceFilter = '';
        instance.applyFilter(selectedItems);

        selectedItems.quickFilter.department = 'test';
        instance.applyFilter(selectedItems);

        selectedItems.quickFilter = [];
        instance.applyFilter(selectedItems);

        instance.getFilterOptions();
    });
});
