// -*- Mode: JavaScript; tab-width: 4; indent-tabs-mode: nil; -*-
// vim:set ft=javascript ts=4 sw=4 sts=4 cindent:

var Config = (function (window, undefined) {

    var bratCollData = {
        'entity_types': [
// this is optional
            {
                'type': 'SPAN_DEFAULT',
                'bgColor': '#7fa2ff',
                'borderColor': 'darken'
            },
            {
                'type': 'Ag',
                'bgColor': '#ff3721',
                'borderColor': 'darken'
            },
            {
                'type': 'Bg',
                'bgColor': '#01ff75',
                'borderColor': 'darken'
            },
            {
                'type': 'Dg',
                'bgColor': '#6d94ff',
                'borderColor': 'darken'
            },
            {
                'type': 'Mg',
                'bgColor': '#77ff32',
                'borderColor': 'darken'
            },
            {
                'type': 'Ng',
                'bgColor': '#ffb3b4',
                'borderColor': 'darken'
            },
            {
                'type': 'Rg',
                'bgColor': '#ff4b3d',
                'borderColor': 'darken'
            },
            {
                'type': 'Tg',
                'bgColor': '#ff57ec',
                'borderColor': 'darken'
            },
            {
                'type': 'Vg',
                'bgColor': '#ff82db',
                'borderColor': 'darken'
            },
            {
                'type': 'Yg',
                'bgColor': '#c126ff',
                'borderColor': 'darken'
            },
            {
                'type': 'a',
                'bgColor': '#e5ff6c',
                'borderColor': 'darken'
            },
            {
                'type': 'ad',
                'bgColor': '#7ccfff',
                'borderColor': 'darken'
            },
            {
                'type': 'an',
                'bgColor': '#67ffcd',
                'borderColor': 'darken'
            },
            {
                'type': 'b',
                'bgColor': '#5af2f1',
                'borderColor': 'darken'
            },
            {
                'type': 'c',
                'bgColor': '#e4deff',
                'borderColor': 'darken'
            },
            {
                'type': 'd',
                'bgColor': '#ff9de4',
                'borderColor': 'darken'
            },
            {
                'type': 'e',
                'bgColor': '#b4b4ff',
                'borderColor': 'darken'
            },
            {
                'type': 'f',
                'bgColor': '#27f4b7',
                'borderColor': 'darken'
            },
            {
                'type': 'h',
                'bgColor': '#f2ff1b',
                'borderColor': 'darken'
            },
            {
                'type': 'i',
                'bgColor': '#cccdff',
                'borderColor': 'darken'
            },
            {
                'type': 'j',
                'bgColor': '#28c163',
                'borderColor': 'darken'
            },
            {
                'type': 'k',
                'bgColor': '#9695ff',
                'borderColor': 'darken'
            },
            {
                'type': 'l',
                'bgColor': '#ff9ef5',
                'borderColor': 'darken'
            },
            {
                'type': 'm',
                'bgColor': '#cdff00',
                'borderColor': 'darken'
            },
            {
                'type': 'n',
                'bgColor': '#12fffc',
                'borderColor': 'darken'
            },
            {
                'type': 'nr',
                'bgColor': '#fffdc3',
                'borderColor': 'darken'
            },
            {
                'type': 'ns',
                'bgColor': '#ffc4cc',
                'borderColor': 'darken'
            },
            {
                'type': '地名',
                'bgColor': '#ffc4cc',
                'borderColor': 'darken'
            },
            {
                'type': 'nt',
                'bgColor': '#4fffa8',
                'borderColor': 'darken'
            },
            {
                'type': '机构团体',
                'bgColor': '#4fffa8',
                'borderColor': 'darken'
            },
            {
                'type': 'nx',
                'bgColor': '#c98dff',
                'borderColor': 'darken'
            },
            {
                'type': 'nz',
                'bgColor': '#05ccff',
                'borderColor': 'darken'
            },
            {
                'type': 'o',
                'bgColor': '#fff6bf',
                'borderColor': 'darken'
            },
            {
                'type': 'p',
                'bgColor': '#94caff',
                'borderColor': 'darken'
            },
            {
                'type': 'q',
                'bgColor': '#76d9f2',
                'borderColor': 'darken'
            },
            {
                'type': 'r',
                'bgColor': '#37ff10',
                'borderColor': 'darken'
            },
            {
                'type': 's',
                'bgColor': '#ffb973',
                'borderColor': 'darken'
            },
            {
                'type': 't',
                'bgColor': '#d1fffb',
                'borderColor': 'darken'
            },
            {
                'type': 'u',
                'bgColor': '#d3b9ff',
                'borderColor': 'darken'
            },
            {
                'type': 'v',
                'bgColor': '#bde7ff',
                'borderColor': 'darken'
            },
            {
                'type': 'vd',
                'bgColor': '#a6fc50',
                'borderColor': 'darken'
            },
            {
                'type': 'vn',
                'bgColor': '#c6b0ff',
                'borderColor': 'darken'
            },
            {
                'type': 'w',
                'bgColor': '#d3ffdc',
                'borderColor': 'darken'
            },
            {
                'type': 'x',
                'bgColor': '#ff4bee',
                'borderColor': 'darken'
            },
            {
                'type': 'y',
                'bgColor': '#b2ffa8',
                'borderColor': 'darken'
            },
            {
                'type': 'z',
                'bgColor': '#77ffff',
                'borderColor': 'darken'
            },
            {
                'type': 'ARC_DEFAULT',
                'color': 'black',
                'arrowHead': 'triangle,5',
                'labelArrow': 'triangle,3,5',
            },
            {
                'type': 'token',
                'labels': ['\u00A0\u00A0'], // non-breaking space for empty
            },
            {
                'type': '-',
                'labels': ['\u00A0\u00A0'], // non-breaking space for empty
            }
        ],
        'event_attribute_types': [],
        'entity_attribute_types': [
            {
                'type': 'Name',
                'values': {
                    'Name': {'glyph': '(N)'},
                },
            },
        ],
        'relation_types': [
// this is optional
//         {
//             'type': 'subj',
//             'labels': [ 'subj' ],
//             'dashArray': '3,3',
//             'color': 'green',
//             'args': [
//                 {
//                     'role': 'arg1',
//                     'targets': [ 'token' ]
//                 },
//                 {
//                     'role': 'arg2',
//                     'targets': [ 'token' ]
//                 }
//             ]
//         }
        ],
        'event_types': [],
    };

    return {
        bratCollData: bratCollData,
    };
})(window);
