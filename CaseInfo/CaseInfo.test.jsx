import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import _clone from 'lodash/clone';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CaseInfoConnect, { CaseInfo } from './CaseInfo';
import data from '../../../test/mock/CommonDetails.json';

describe('Test suits for <CaseInfo />', () => {
    const mockStore = configureStore([]);
    const store = mockStore({ context: { deviceType: { isDeskTop: true } }, caseDetailsData: _clone(data) });
    let wrapper;
    beforeEach(() => {
        wrapper = mount(
            <Provider store={store}>
                <CaseInfoConnect />
            </Provider>,
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });
    const caseDetails1 = _clone(data);
    caseDetails1.contacts[0].lastName = '';
    caseDetails1.contacts[0].city = '';
    caseDetails1.contacts[0].address1 = '';
    caseDetails1.contacts[0].zipCode = '';
    const closeCaseModal = sinon.spy();
    const onSelectCaseOperation = sinon.spy();
    const doCaseOperation = sinon.spy();
    const actions = { closeCaseModal, onSelectCaseOperation, doCaseOperation };
    const shallowWrapper = shallow(<CaseInfo caseId={'23442424342'} caseDetailsData={caseDetails1} actions={actions} />);
    it('should load the CaseInfo component', () => {
        expect(wrapper).to.exist;
        expect(wrapper).to.have.length(1);
    });
    it('should CaseSearch without searchlist', () => {
        wrapper = shallow(<CaseInfo caseDetailsData={caseDetails1} />);
        const instance = wrapper.instance();
        instance.backToSearch();
    });
    it('To invoke reopenCase function', () => {
        shallowWrapper.setProps({
            caseDetailsData: {
                status: { value: 'Closed' },
            },
        });
        shallowWrapper.instance().render();
    });
    it('To invoke reopenCase function', () => {
        caseDetails1.contacts[0].type = 'caller';
        const shallowRenderComp = shallow(<CaseInfo actions={actions} caseDetailsData={caseDetails1} />);
        shallowRenderComp.instance().reopenCase();
    });
    it('To invoke closeReopenCase function', () => {
        caseDetails1.contacts[0].type = '';
        const shallowRender = shallow(<CaseInfo actions={actions} caseDetailsData={caseDetails1} />);
        shallowRender.instance().closeReopenCase();
    });
    it('toggleFilterBox funtion should be invoked', () => {
        shallowWrapper.setState({ expanded: true });
        shallowWrapper.instance().toggleFilterBox();
    });
    it('onClickAssign funtion should be invoked', () => {
        shallowWrapper.instance().onClickAssign();
    });
});
