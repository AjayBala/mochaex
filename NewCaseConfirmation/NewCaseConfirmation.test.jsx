import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { describe, it } from 'mocha';
import { NewCaseConfirmation } from './NewCaseConfirmation';

const onCloseConfirmModal = sinon.spy();
const newCaseInfo = {
    created: '1517342429000',
    modified: '1517343906000',
    status: {
        value: 'Open',
    },
    description: 'Shortage',
    priority: 'Low',
    orderNumber: '2018018585709978',
    department: {
        id: '6',
        name: 'SLC',
        caseType: '24HR Cancel',
    },
    contacts: [
        {
            id: '1079453235',
            type: 'registered',
            firstName: 'Kaploe',
            lastName: 'Sara',
            phoneNumber: '5558641913',
            email: 'tony.ferandez1@mailnator.com',
            address1: 'Tony Python Code And Intellectual Property Protection',
            address2: 'Ferandez 799 E Dragram Suite 5a,San Antonio',
            city: 'Washington',
            state: 'Washington D C',
            country: 'USA',
            zipCode: '85170',
        },
        {
            id: '1079453235',
            type: 'caller',
            firstName: 'Kaploe',
            lastName: 'Sara',
            phoneNumber: '5558641913',
            email: 'tony.ferandez1@mailnator.com',
            address1: 'Tony Python Code And Intellectual Property Protection',
            address2: 'Ferandez 799 E Dragram Suite 5a,San Antonio',
            city: 'Washington',
            state: 'Washington D C',
            country: 'USA',
            zipCode: '85170',
        },
        {
            id: '1079453235',
            type: 'guest',
            firstName: 'Kaploe',
            lastName: 'Sara',
            phoneNumber: '5558641913',
            email: 'tony.ferandez1@mailnator.com',
            address1: 'Tony Python Code And Intellectual Property Protection',
            address2: 'Ferandez 799 E Dragram Suite 5a,San Antonio',
            city: 'Washington',
            state: 'Washington D C',
            country: 'USA',
            zipCode: '85170',
        },
    ],
    activities: [
        {
            id: '72',
            type: 'Work Note',
            source: [
                {
                    id: 'Agent',
                    name: 'Wright, Angela',
                },
            ],
            created: '02/22/18 03:04 pm',
            note: 'I submitted an adjustment for the missing item. Tracking shows delivered but customer never received.',
        },
        {
            id: '68',
            type: 'Case Created',
            source: [
                {
                    id: 'Agent',
                    name: 'System',
                },
            ],
            created: '01/30/18 02:00 pm',
        },
    ],
    actionTypes: [
        {
            code: '96',
            name: 'Add Case Note',
        },
        {
            code: '97',
            name: 'Close Case',
        },
        {
            code: '98',
            name: 'Extend Case',
        },
        {
            code: '99',
            name: 'Close as Duplicate',
        },
        {
            code: '100',
            name: 'Assign to Agent',
        },
        {
            code: '101',
            name: 'Change Department',
        },
        {
            code: '102',
            name: 'Release Case',
        },
        {
            code: '103',
            name: 'Escalate Case',
        },
        {
            code: '104',
            name: 'Link Customer',
        },
        {
            code: '105',
            name: 'Edit Case Details',
        },
        {
            code: '107',
            name: 'ReOpen Case',
        },
        {
            code: '108',
            name: 'Print',
        },
    ],
};
describe('<NewCaseConnected />', () => {
    const wrapperForm = shallow(<NewCaseConfirmation
        newCaseInfo={newCaseInfo}
        actions={{
            onCloseConfirmModal,
        }}/>);

    it('checking case component', () => {
        expect(wrapperForm).to.exist;
    });
    it('closeModal function should be invoked', () => {
        wrapperForm.instance().closeModal();
    });
});
describe('<NewCaseConnected />', () => {
    const data = { error: 'error' };
    const wrapperForm = shallow(<NewCaseConfirmation
        newCaseInfo={data}
        actions={{
            onCloseConfirmModal,
        }}/>);
    it('checking case component', () => {
        expect(wrapperForm).to.exist;
    });
    it('closeModal function should be invoked', () => {
        wrapperForm.instance().closeModal();
    });
});
describe('<NewCaseConnected />', () => {
    newCaseInfo.contacts[0].city = '';
    newCaseInfo.contacts[0].address1 = '';
    newCaseInfo.contacts[0].zipCode = '';
    newCaseInfo.contacts[0].lastName = '';
    const wrapperForm = shallow(<NewCaseConfirmation
        newCaseInfo={newCaseInfo}
        actions={{
            onCloseConfirmModal,
        }}/>);
    it('checking case component', () => {
        expect(wrapperForm).to.exist;
    });
    it('closeModal function should be invoked', () => {
        wrapperForm.instance().closeModal();
    });
});
