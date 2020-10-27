fs = require('fs');

const data = [
    { name: 'need_phone', type: 'FormWidthPhone', pefix: 'Phone' },
    { name: 'has_quants', type: 'FormWidthQuants', pefix: 'Quants' },
    { name: 'has_mobcom', type: 'FormWidthMobcome', pefix: 'Mobcome' },
];

const trueVal = 'BoolEnum.TRUE';
const falseVal = 'BoolEnum.FALSE';

const fileBegin =
    "import { FormWidthPhone, FormWidthQuants, FormWidthMobcome, BoolEnum } from './index';\n\n";

function recurs(max, level, value, arr) {
    if (level < max) {
        recurs(max, level + 1, [...value, { name: '', type: '' }], arr);
        recurs(max, level + 1, [...value, data[level]], arr);
    } else {
        arr.push(value);
    }
}

function createFileRow(data) {
    const typesArr = [];

    recurs(data.length, 0, [], typesArr);

    const generatedData = typesArr.slice(1).map(item => {
        const typeName = 'OtherMethodFormWidth' + item.map(({ pefix }) => (pefix ? pefix : '')).join('');
        const body = item
            .map(({ name }, index) => data[index].name + ': ' + (name ? trueVal : falseVal) + ';\n')
            .join('');
        const types = item.map(({ type }) => (type ? ' & ' + type : '')).join('');

        return { typeName, body, types };
    });

    return (
        fileBegin +
        generatedData
            .map(({ typeName, body, types }) => {
                return 'type ' + typeName + ' = {\n' + body + '}' + types;
            })
            .join(';\n\n') +
        '\n\nexport type GeneratedOtherMethodFormState = ' +
        generatedData.map(({ typeName }) => typeName).join(' | ') +
        ';\n'
    );
}

fs.writeFile(__dirname + '/type.ts', createFileRow(data), function (err) {
    if (err) return console.log(err);
    console.log('write > type.ts');
});
