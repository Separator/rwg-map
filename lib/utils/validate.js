const regExpCollection = {
    int: /^\d+$/,
    arrInt: /^\d+(\s*\,\s*\d+)*$/,
    string: /^.+$/
};

const CHECK_TYPE = 0;
const DEFAULT_VALUE = 1;
const IS_REQUIRED = 2;
const GROUP_NAME = 3;

const append = (name, regExp) =>
    regExpCollection[name] = regExp;

const compose = (...fns) =>
    (arg) =>
        fns.reduce(
            (composed, f) => f(composed),
            arg
        );

const getDataFromArgv = () => {
    const KEY_NAME = 1;
    const KEY_VALUE = 2;
    let result = {};
    process.argv.forEach((item, i) => {
        if (i > 1) {
            let data = item.match(/^(-{1,2}[a-z0-9\-_]+)=(.+)$/i);
            if (data) {
                result[data[KEY_NAME]] = data[KEY_VALUE];
            } else {
                data = item.match(/^(-[a-z]+)$/i);
                if (data) {
                    result[data[KEY_NAME]] = true;
                }
            }
        }
    });
    return result;
};

const normalizeDataKeys = data =>
    Object.keys(data).reduce((result, key) =>{
        result[key.replace(/-/g, '')] = data[key];
        return result;
    }, {});

const reduceDataAccordingToRules = rules => data =>
    Object.keys(data).reduce((result, key) =>
            (key in rules) ? {...result, [key]: data[key]} : result
        , {});

const validateDataAccordingToRules = rules => data =>
    Object.keys(data).reduce((result, paramName) => {
        let rule = rules[paramName];
        let checkType = rule[CHECK_TYPE];
        let value = data[paramName];
        switch (checkType.constructor) {
            case RegExp:
                return (checkType.test(value)) ?
                    {...result, [paramName]: value} : result;
            case Function:
                return (checkType(value)) ?
                    {...result, [paramName]: value} : result;
            case String:
                return (checkType in regExpCollection) ?
                    regExpCollection[checkType].test(value) ? {...result, [paramName]: value} : result :
                    result;

        }
    }, {});

const convertDataAccordingToRules = rules => data =>
    Object.keys(data).reduce((result, key)=>{
        let rule = rules[key][CHECK_TYPE];
        let value = data[key];
        if (rule.constructor === String) {
            switch (rule) {
                case 'int':
                    value = + value;
                    break;
                case 'arrInt':
                    value = value.split(',').map(item => + item);
                    break;
            }
        }
        return {
            ...result,
            [key]: value
        }
    }, {});


const getParamGroups = rules =>
    Object.keys(rules).reduce((result, paramName) =>
        (rules[paramName][GROUP_NAME]) ? {
            ...result,
            [rules[paramName][GROUP_NAME]]: (result[rules[paramName][GROUP_NAME]])
                ? [...result[rules[paramName][GROUP_NAME]], paramName] : [paramName]
        }: result, {});

const groupDataAccordingToRules = rules => {
    let groups = getParamGroups(rules);
    return Object.keys(groups).length ? data => {
        let alreadyUsedGroup = {};
        return Object.keys(data).reduce((result, key) => {
            let inGroup = false;
            for (let groupName in groups) {
                let paramList = groups[groupName];
                if (paramList.indexOf(key) > -1) {
                    inGroup = groupName;
                    break;
                }
            }
            if (inGroup) {
                if (inGroup in alreadyUsedGroup) {
                    return result;
                } else {
                    alreadyUsedGroup[inGroup] = true;
                    return {
                        ...result,
                        [key]: data[key]
                    }
                }
            } else {
                return {
                    ...result,
                    [key]: data[key]
                }
            }
        }, {});
    } : data => data;
};

const checkRequiredFields = rules => data => {
    let groups = getParamGroups(rules);
    for (let paramName in rules) {
        let rule = rules[paramName];
        if (rule[IS_REQUIRED] && data[paramName] === undefined) {
            if (Object.keys(groups).length) {
                let paramInGroup = false;
                for (let groupName in groups) {
                    let group = groups[groupName];
                    if (group.indexOf(paramName) > -1) {
                        group.forEach(param => {
                            if (data[param] !== undefined) {
                                paramInGroup = true;
                            }
                        })
                    }
                }
                if (!paramInGroup) {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
    return data;
};

const setDefaultAccordingToRules = rules => data =>
    Object.keys(rules).reduce((result, paramName) =>
        (data[paramName] === undefined && rules[paramName][DEFAULT_VALUE] !== undefined) ? {
            ...result,
            [paramName]: rules[paramName][DEFAULT_VALUE]
        } : result, data);

const validate = (rules={}) => {
    return compose(
        getDataFromArgv,
        normalizeDataKeys,
        reduceDataAccordingToRules(rules),
        validateDataAccordingToRules(rules),
        convertDataAccordingToRules(rules),
        groupDataAccordingToRules(rules),
        setDefaultAccordingToRules(rules),
        checkRequiredFields(rules)
    )();
};

module.exports = {
    append,
    validate
};
