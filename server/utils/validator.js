/**
 * Class handling validations
 */
export default class ValidatorClass {
  /**
   * Validates form input
   * @param {*} field
   * @param {*} value
   * @param {*} payload
   * @returns {string} validation message
   */
  static fieldValidator(field, value, payload) {
    switch (field) {
      case `${field}`:
        if (!value || !(/\S/.test(value))) {
          return 'This field is required';
        }

      /* es-lint-disable-no-fallthrough */
      case 'numberToGenerate':
        if ((field === 'numberToGenerate') && value && !this.isInteger(value)) {
          return 'Value must be an integer';
        }

      /* es-lint-disable-no-fallthrough */
      case 'numberToGenerate':
        if ((field === 'numberToGenerate') && value && Number(value) > 10000) {
          return 'Number of phone numbers to be generated cannot be more than 10000';
        }

      /* es-lint-disable-no-fallthrough */
      case 'filename':
        if ((field === 'filename') && value && !value.endsWith('.txt')) {
          return 'Filename must end with .txt';
        }

      default:
        break;
    }
  }

  static isInteger = (value) => Number.isInteger(Number.parseFloat(value, 10))

  /**
   * Loops through each field and calls the field validator method on it
   * @param {*} enumArray
   * @param {*} payload
   * @returns {object} returns validation status and object containing errors
   */
  static validateFields(enumArray, payload) {
    const errors = {};
    enumArray.forEach((item) => {
      const value = payload[item];
      errors[item] = this.fieldValidator(item, value, payload);
    });
    return {
      errors: { validations: JSON.parse(JSON.stringify(errors)) },
      isValid: !Object.keys(JSON.parse(JSON.stringify(errors))).length
    };
  }

  static validateFieldsSync(enumArray, source) {
    try {
      const { errors, isValid } = this.validateFields(enumArray, source);
      if (!isValid) {
        throw errors;
      }
      return {
        errors,
        isValid
      };
    } catch (error) {
      return {
        errors: error,
        isValid: false,
      };
    }
  }
}
