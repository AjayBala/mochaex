import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import _clone from 'lodash/clone';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CaseOperationModalConnected, { CaseOperationModal } from './CaseOperationModal';
import data from '../../../test/mock/common.json';
import settings from '../../settings.json';

const preference = _clone(settings.preferences.common);

describe('Test suits for <CaseOperationModal />', () => {
    const mockStore = configureStore([]);
    const store = mockStore({
        context: {
            preferences: preference,
        },
        caseDetailsData: _clone(data),
        caseDetails: {
            caseNote: '',
        },
        closeModal: () => { },
    });
    const defaultProps = {
        actions: { doCaseOperation: () => { }, onInputChange: () => {} },
        actionType: preference.actionAddCase,
        preferences: preference,
    };
    const wrapper = mount(
        <Provider store={store}>
            <CaseOperationModalConnected {..._clone(data)}/>
        </Provider>,
    );
    const shallowWrapper = shallow(
        <CaseOperationModal preferences={preference} {...defaultProps} {..._clone(data)}/>,
    );
    it('should load the CaseOperationModal component', () => {
        expect(wrapper.find('ModalBox')).to.have.length(1);
        expect(wrapper).to.exist;
    });
    it('Check the on input change', () => {
        const field = 'originalCaseId';
        shallowWrapper.instance().onInputChange({ target: { id: 'CaseOperationModalId', value: '234342323232' } }, field);
        expect(shallowWrapper.instance().state.originalCaseId).to.equal('234342323232');
    });
    it('Check the on input change', () => {
        const field = 'desc';
        shallowWrapper.instance().onInputChange({ target: { id: 'CaseOperationModalId', value: 'desc' } }, field);
        expect(shallowWrapper.instance().state.desc).to.equal('desc');
    });
    it('Check the on input change', () => {
        const field = '';
        shallowWrapper.instance().onInputChange({ target: { id: 'CaseOperationModalId', value: 'desc' } }, field);
        expect(shallowWrapper.instance().state.desc).to.equal('desc');
    });
    it('Check the on input change', () => {
        const field = '';
        shallowWrapper.instance().onInputChange({ target: { id: 'CaseOperationModalId', value: 'desc' } }, field);
        expect(shallowWrapper.instance().state.desc).to.equal('desc');
    });
    it('Check the on getRequestParams', () => {
        const type = 'EXPLICIT';
        shallowWrapper.instance().getRequestParams(type);
        expect(shallowWrapper.instance().state.desc).to.equal('desc');
        expect(shallowWrapper).to.exist;
    });
    it('Check the on getRequestParams', () => {
        const type = 'EXPIRY';
        shallowWrapper.instance().getRequestParams(type);
        expect(shallowWrapper.instance().state.desc).to.equal('desc');
        expect(shallowWrapper).to.exist;
    });
    it('Check the on getRequestParams', () => {
        const type = 'AGENT';
        shallowWrapper.instance().getRequestParams(type);
        expect(shallowWrapper.instance().state.desc).to.equal('desc');
        expect(shallowWrapper).to.exist;
    });
    it('Check the on getRequestParams', () => {
        const type = 'DEPT';
        shallowWrapper.instance().getRequestParams(type);
        expect(shallowWrapper.instance().state.desc).to.equal('desc');
        expect(shallowWrapper).to.exist;
    });
    it('Check the on getRequestParams', () => {
        const type = 'STATUS';
        shallowWrapper.instance().getRequestParams(type);
        expect(shallowWrapper.instance().state.desc).to.equal('desc');
        expect(shallowWrapper).to.exist;
    });
    it('Check the on getRequestParams', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: '99',
        };
        const caseDetailsError = { errorMessage: 'test' };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} caseDetailsError={caseDetailsError}/>,
        );
        const type = 'STATUS';
        shallowWrapper2.instance().getRequestParams(type);
        expect(shallowWrapper2.instance().state.desc).to.equal('');
        expect(shallowWrapper2).to.exist;
        shallowWrapper2.instance().setState({ originalCaseId: 'test' });
        shallowWrapper2.instance().validate();
        shallowWrapper2.instance().setState({ originalCaseId: '123456789123456' });
        shallowWrapper2.instance().validate();
        shallowWrapper2.instance().submit();
    });
    it('Check the on getRequestParams', () => {
        const defaultProps2 = {
            closeModal: () => { },
            caseDetailsError: { errorMessage: 'test' },
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        shallowWrapper2.instance().closeModalBox();
    });
    it('Check the on getRequestParams', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: '100',
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        shallowWrapper2.instance().setState({ desc: 'test' });
        shallowWrapper2.instance().validate();
        shallowWrapper2.instance().setState({ desc: 'minimum charecter checking' });
        shallowWrapper2.instance().validate();
        shallowWrapper2.instance().setState({ selectedId: '123' });
        shallowWrapper2.instance().validateDropDown();
    });
    it('Check the on getRequestParams', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: '101',
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        shallowWrapper2.instance().validateDropDown();
        shallowWrapper2.instance().setState({ reasonId: '566546', selectedDeptId: '123' });
        shallowWrapper2.instance().validateDropDown();
    });
    it('Check the on getRequestParams', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        shallowWrapper2.instance().validate();
    });
    it('addCase funtion should be invoked', () => {
        shallowWrapper.instance().getRequestParams();
    });
    it('addCase funtion should be invoked', () => {
        shallowWrapper.instance().onChangeAgent('20181032');
        shallowWrapper.instance().onChangeDepartment('20181032');
    });
    it('addCase funtion should be invoked', () => {
        shallowWrapper.instance().onReasonChangeAction('Need Help');
    });
    it('addCase funtion should be invoked', () => {
        shallowWrapper.instance().onReasonChangeAction('');
    });
    it('Check the on empty data', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: '100',
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} {..._clone(data)}/>,
        );
        shallowWrapper2.instance().onChangeAgent('20181032');
        shallowWrapper2.instance().onChangeDepartment('1');
    });
    it('Check the on empty data', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} {..._clone(data)}/>,
        );
        shallowWrapper2.instance().getRequestParams();
    });
    it('Check the on empty data', () => {
        const defaultProps2 = {
            actionType: '102',
        };
        const department = {
            department: { id: '1', name: 'AP' },
        };

        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} caseDetails={department}/>,
        );
        shallowWrapper2.instance().getRequestParams('EXPLICIT');
    });
    it('Check the on with data', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        shallowWrapper2.instance().onChangeAgent('20181032');
        shallowWrapper2.instance().onChangeDepartment('20181032');
    });
    it('closeModal function should be invoked', () => {
        shallowWrapper.instance().setState({ desc: '' });
        shallowWrapper.instance().submit();
    });
    it('closeModal function should be invoked', () => {
        shallowWrapper.instance().setState({ desc: 'his case is related to invoices and Adjustments.' });
        shallowWrapper.instance().submit();
    });
    it('Check on Error Case', () => {
        shallowWrapper.instance().setState({ hasError: true });
        shallowWrapper.instance().render();
    });
    it('Check if the case operation done', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: '99',
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        shallowWrapper2.instance().setState({ originalCaseId: '' });
        shallowWrapper2.instance().validate();
        expect(shallowWrapper2.instance().state.originalCaseId).to.equal('');
    });
    it('Check if the case operation done', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: '99',
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        shallowWrapper2.instance().setState({ caseId: '201802010' });
        shallowWrapper2.instance().validate();
        expect(shallowWrapper2.instance().state.caseId).to.equal('201802010');
    });
    it('Check if the case operation done', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: '100',
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        shallowWrapper2.instance().setState({ originalCaseId: '201802010' });
        shallowWrapper2.instance().validate();
        expect(shallowWrapper2.instance().state.originalCaseId).to.equal('201802010');
    });
    it('Check if the case operation done', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: '101',
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        shallowWrapper2.instance().setState({ originalCaseId: '201802010' });
        shallowWrapper2.instance().validate();
        expect(shallowWrapper2.instance().state.originalCaseId).to.equal('201802010');
    });
    it('Check if the case operation done', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: '99',
        };
        const caseDetailsError = { errorMessage: 'test' };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} caseDetailsError={caseDetailsError} />,
        );
        shallowWrapper2.instance().setState({ originalCaseId: '2018020101212212' });
        shallowWrapper2.instance().validate();
        expect(shallowWrapper2.instance().state.originalCaseId).to.equal('2018020101212212');
        shallowWrapper2.instance().setState({ originalCaseId: 'test' });
        shallowWrapper2.instance().validate();
        shallowWrapper2.instance().setState({ originalCaseId: ' space' });
        shallowWrapper2.instance().validate();
    });
    it('getActionTypeStr funtion should return valid action type string for change department', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: '101',
            preferences: preference,
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        expect(shallowWrapper2.instance().getActionTypeStr()).to.equal('DEPT');
    });

    it('getActionTypeStr funtion should return valid action type string for reopen case', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: '107',
            preferences: preference,
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        expect(shallowWrapper2.instance().getActionTypeStr()).to.equal('STATUS');
    });

    it('getActionTypeStr funtion should return valid action type string for assign to agent', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: '100',
            preferences: preference,
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        expect(shallowWrapper2.instance().getActionTypeStr()).to.equal('AGENT');
    });

    it('getActionTypeStr funtion should return valid action type string for add note', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: '96',
            preferences: preference,
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        expect(shallowWrapper2.instance().getActionTypeStr()).to.equal('EXPLICIT');
    });

    it('getActionTypeStr funtion should return valid action type string for invalid scenario', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: 'Invalid',
            preferences: preference,
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        expect(shallowWrapper2.instance().getActionTypeStr()).to.equal(null);
    });

    it('getActionTypeStr funtion should return valid action type string for extend case', () => {
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: '98',
            preferences: preference,
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        expect(shallowWrapper2.instance().getActionTypeStr()).to.equal('EXPIRY');
    });

    it('Componentwillreceiveprops with reinitiate scenario', () => {
        const AddCaseWrapper = new CaseOperationModal();

        AddCaseWrapper.props = {
            showModal: false,
        };
        const nextProps = {
            showModal: true,
        };
        AddCaseWrapper.componentWillReceiveProps(nextProps);
    });
    it('Componentwillreceiveprops with openCaseOperationModal false scenario', () => {
        shallowWrapper.setProps({
            showModal: {
                showModal: false,
            },
        });
        shallowWrapper.instance().render();
    });
    it('Find text area for case operation', () => {
        const field = 'originalCaseId';
        shallowWrapper.find('textarea').at(0).props().onChange({ target: { id: 'CaseOperationModalId', value: '234342323232' } }, field);
        shallowWrapper.instance().onInputChange({ target: { id: 'CaseOperationModalId', value: '234342323232' } }, field);
        expect(shallowWrapper.instance().state.originalCaseId).to.equal('234342323232');
        expect(shallowWrapper).to.exist;
    });
    it('Find input box for case operation', () => {
        const field = 'originalCaseId';
        const defaultProps2 = {
            actions: { doCaseOperation: () => { } },
            actionType: '99',
        };
        const shallowWrapper2 = shallow(
            <CaseOperationModal preferences={preference} {...defaultProps2} />,
        );
        shallowWrapper2.find('input').at(0).props().onChange({ target: { id: 'CaseOperationModalId', value: '234342323232' } }, field);
        expect(shallowWrapper.instance().state.originalCaseId).to.equal('234342323232');
        expect(shallowWrapper).to.exist;
    });
});
