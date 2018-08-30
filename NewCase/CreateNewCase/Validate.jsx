import {
    validateName,
    validatePhone,
    validateStreet,
    validateEmail,
    validateCity,
    validateApt,
    validateZip,
    validateOrder,
    validateDesc,
    validateCaseType,
    validatePriority,
} from '../../../common/Util';

export const normalizePhone = (value, previousValue) => {
    if (!value) {
        return value;
    }
    const onlyNums = value.replace(/[^\d]/g, '');
    if (!previousValue || value.length > previousValue.length) {
        // typing forward
        if (onlyNums.length === 3) {
            return `${onlyNums} `;
        }
        if (onlyNums.length === 6) {
            return `${onlyNums.slice(0, 3)} ${onlyNums.slice(3)}-`;
        }
    }
    if (onlyNums.length <= 3) {
        return onlyNums;
    }
    if (onlyNums.length <= 6) {
        return `${onlyNums.slice(0, 3)} ${onlyNums.slice(3)}`;
    }
    return `${onlyNums.slice(0, 3)} ${onlyNums.slice(3, 6)}-${onlyNums.slice(6, 10)}`;
};

export const normalizeZip = (value) => {
    if (!value) {
        return value;
    }
    const onlyNums = value.replace(/[^\d]/g, '');
    return `${onlyNums.slice(0, 5)}`;
};

export const restrictmaxLength = (value, length, label) => {
    value = label === 'city' ? value.replace(/[^A-Za-z ]/g, '') : value;
    return value.slice(0, length);
};

const validate = (values, props) => {
    const { isEditCase } = props;
    const {
        firstName,
        lastName,
        phoneNumber,
        email,
        apt,
        zip,
        streetAddress,
        city,
        order,
        desc,
        caseType,
        priority } = values;
    const { contactAvailable, addCallerContact } = props.caseInfo || {};
    const isDisable = addCallerContact && isEditCase;
    const isDisablePhoneOrEmail = !addCallerContact && isEditCase;
    const contactAvailableFlag = contactAvailable || false;
    const errors = {};

    const firstNameError = validateName(firstName, 'First Name', contactAvailableFlag, isDisable);
    /* istanbul ignore else */
    if (firstNameError) {
        errors.firstName = firstNameError;
    }

    const lastNameError = validateName(lastName, 'Last Name', contactAvailableFlag, isDisable);
    /* istanbul ignore else */
    if (lastNameError) {
        errors.lastName = lastNameError;
    }

    const phoneNumberError = validatePhone(phoneNumber, email, contactAvailableFlag, 'Phone Number', isDisablePhoneOrEmail);
    /* istanbul ignore else */
    if (phoneNumberError) {
        errors.phoneNumber = phoneNumberError;
    }

    const emailError = validateEmail(email, phoneNumber, contactAvailableFlag, 'Email', isDisablePhoneOrEmail);
    /* istanbul ignore else */
    if (emailError) {
        errors.email = emailError;
    }

    const aptError = validateApt(apt, 'Apt, Suite, Bldg');
    /* istanbul ignore else */
    if (aptError) {
        errors.apt = aptError;
    }

    const zipError = validateZip(zip, isEditCase);
    /* istanbul ignore else */
    if (zipError) {
        errors.zip = zipError;
    }

    const streetError = validateStreet(streetAddress, 'Street');
    /* istanbul ignore if */
    /* istanbul ignore else */
    if (streetError) {
        errors.streetAddress = streetError;
    }

    const cityError = validateCity(city, isEditCase);
    if (cityError) {
        errors.city = cityError;
    }

    const caseTypeError = validateCaseType(caseType, isEditCase);
    if (caseTypeError) {
        errors.caseType = caseTypeError;
    }

    const priorityError = validatePriority(priority);
    if (priorityError) {
        errors.priority = priorityError;
    }

    const orderError = validateOrder(order);
    if (orderError) {
        errors.order = orderError;
    }

    const descriptionError = validateDesc(desc, isEditCase);
    /* istanbul ignore else */
    if (descriptionError) {
        errors.desc = descriptionError;
    }

    return errors;
};

export default validate;
