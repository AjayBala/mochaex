import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import _clone from 'lodash/clone';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CaseDetailsConnect, { CaseDetails } from './CaseDetails';
import data from '../../../test/mock/CommonDetails.json';
import settings from '../../settings.json';

const preference = _clone(settings.preferences.common);


describe('Test suits for <CaseDetails />', () => {
    const mockStore = configureStore([]);
    const store = mockStore({
        context: {
            deviceType: { isDeskTop: true },
            preferences: preference,
        },
        newCaseInfo: { updateStatus: {
        } },
        caseDetailsData: _clone(data) });
    let wrapper;
    beforeEach(() => {
        wrapper = mount(
            <Provider store={store}>
                <CaseDetailsConnect />
            </Provider>,
        );
    });
    it('should load the CaseDetails component', () => {
        expect(wrapper).to.exist;
        expect(wrapper).to.have.length(1);
    });
});

describe('Test suits for pop window', () => {
    const closeCaseModal = sinon.spy();
    const onSelectCaseOperation = sinon.spy();
    const getSourceText = sinon.spy();
    const getDestinationText = sinon.spy();
    const defaultPopUp = sinon.spy();
    const defaultProps = {
        preferences: preference,
        newCaseInfo: { updateStatus: { type: 'Success' } },
        openAddCaseNote: () => { },
        getSourceText,
        getDestinationText,
        caseDetailsData: _clone(data),
        actions: { closeCaseModal, onSelectCaseOperation, defaultPopUp },
    };
    defaultProps.caseDetailsData.status.value = 'Closed';
    const shallowWrapper = shallow(
        <CaseDetails {...defaultProps} />,
    );
    it('caseOperationModal funtion should be invoked', () => {
        shallowWrapper.instance().closeModal();
    });
    it('To invoke on change function with valid value', () => {
        shallowWrapper.instance().onChangeAction('41');
    });
    it('To invoke on change function with valid value', () => {
        shallowWrapper.instance().onChangeAction('43');
    });
    it('To invoke on change function with valid value', () => {
        shallowWrapper.instance().onChangeAction('45');
    });
    it('To invoke on change function with valid value', () => {
        shallowWrapper.instance().onChangeAction('47');
    });
    it('To invoke on change function with valid value', () => {
        shallowWrapper.instance().onChangeAction('102');
    });
    it('To invoke on change function with valid value', () => {
        shallowWrapper.instance().onChangeAction('50');
    });
    it('To invoke on change function with valid value', () => {
        shallowWrapper.instance().onChangeAction('105');
    });
    it('To invoke on change function for print with valid value', () => {
        const inst = shallowWrapper.instance();
        inst.componentRef = {
            innerHTML: 'test',
        };
        inst.onChangeAction('108');
    });
    it('renderPrintFunction funtion should be invoked', () => {
        shallowWrapper.instance().renderPrintSection();
    });
});

describe('Test suits for AddCaseNote pop window', () => {
    const getSourceText = sinon.spy();
    const getDestinationText = sinon.spy();
    const defaultProps = {
        openAddCaseNote: () => {},
        getSourceText,
        getDestinationText,
        caseDetailsData: _clone(data),
        newCaseInfo: { updateStatus: { type: 'Error' } },
        actions: { defaultPopUp: sinon.spy() },
        preferences: preference,
    };
    defaultProps.caseDetailsData.status.value = 'Open';
    const defaultPopUp = sinon.spy();
    const shallowWrapper = shallow(
        <CaseDetails {...defaultProps} actions={{ defaultPopUp }}/>,
    );
    it('To invoke on change function with valid value', () => {
        shallowWrapper.instance().onChangeAction('46');
    });
    it('To invoke closeStatus function', () => {
        shallowWrapper.instance().closeStatus();
    });
});
describe('Test suits for AddCaseNote pop window', () => {
    const getSourceText = sinon.spy();
    const getDestinationText = sinon.spy();
    const defaultProps = {
        openAddCaseNote: () => {},
        getSourceText,
        getDestinationText,
        caseDetailsData: _clone(data),
        newCaseInfo: { updateStatus: { message: 'Success' } },
        preferences: preference,
    };
    defaultProps.caseDetailsData.status.value = 'ReOpened';
    const shallowWrapper = shallow(
        <CaseDetails {...defaultProps} />,
    );
    it('To invoke on change function with valid value', () => {
        shallowWrapper.instance().onChangeAction('41');
    });
    it('toggleFilterBox funtion should be invoked', () => {
        shallowWrapper.instance().toggleFilterBox();
    });
});
