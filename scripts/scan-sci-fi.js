// Scan zh.json for sci-fi/tech terms that need cultivation replacement
import zh from '../src/locales/zh.json' with { type: 'json' };

// Clearly sci-fi/industrial terms that break cultivation immersion
const mustReplace = [
    '采集器', '钻头', '钻探', '反应堆', '引擎', '空间站',
    '电场', '电子', '磁力', '裂变', '聚变', '量子',
    '发射', '轨道', '行星', '舰队', '侦察', '卫星',
    '提取', '燃料', '压缩机', '合金', '合成器', '制造机',
    '生产线', '设备', '装置', '仪器', '机械', '工程',
    '实验室', '功率', '产能', '工厂', '车间', '推进',
    '殖民地', '护盾', '装甲', '武器', '导弹', '鱼雷',
    '扫描', '信号', '通信', '传输', '数据', '网络',
    '终端', '传感器', '探测器', '望远镜', '加速器',
    '转换器', '交换机', '运输', '物流', '过载', '超负荷',
    '限制器', '故障', '错误', '异常', '爆炸', '崩溃',
    '失效', '失灵', '损坏', '破坏', '摧毁',
];

let found = [];
for (const [key, val] of Object.entries(zh)) {
    if (typeof val !== 'string' || val === '') continue;
    if (key.startsWith('star')) continue;
    for (const term of mustReplace) {
        if (val.includes(term)) {
            found.push({ key, val, term });
            break;
        }
    }
}

console.log('zh.json entries with sci-fi terms (count: ' + found.length + '):\n');
found.forEach(f => console.log('[' + f.term + '] ' + f.key + ': ' + f.val));
