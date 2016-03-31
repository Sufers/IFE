function addEvent(element, event, listener) {
        if (element.addEventListener) { //标准
            element.addEventListener(event, listener, false);
        } else if (element.attachEvent) { //低版本ie
            element.attachEvent("on" + event, listener);
        } else { //都不行的情况
            element["on" + event] = listener;
        }
    }
/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: 0,
    nowGraTime: "day"
};

/**
 * 渲染图表
 */
function renderChart() {
    var container=document.getElementsByClassName("aqi-chart-wrap")[0];
    var html="";
    for(var x in chartData)
        html+='<div  class="bar-'+pageState.nowGraTime+'" style="height:'+chartData[x]+'px;background-color:#'+Math.floor((1-chartData[x]/500)*0xFFFFFF).toString(16)+';"></div>';
    container.innerHTML=html;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {

    var time_select =document.getElementsByName("gra-time");
    for(var i=0;i<time_select.length;i++)
        if(time_select[i].checked ==true && time_select[i].value!=pageState.nowGraTime)// 确定是否选项发生了变化
        {
            pageState.nowGraTime = time_select[i].value;
        }
    // 设置对应数据
    initAqiChartData();
    // 调用图表渲染函数
    //renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    var city_select= document.getElementById("city-select");
    if(city_select.selectedIndex !=  pageState.nowSelectCity)
    pageState.nowSelectCity=city_select.selectedIndex;
    // 设置对应数据
    initAqiChartData();

    // 调用图表渲染函数
    //renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    addEvent(document.getElementById("form-gra-time"),'click',graTimeChange);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项

    var city_select=document.getElementById("city-select");
    var cities="";
    for(var x in aqiSourceData)
    {cities+="<option>"+x+"</option>";}
    city_select.innerHTML=cities;
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    addEvent(city_select,'change',citySelectChange);
}
/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    chartData={};
    var city_data=aqiSourceData[Object.getOwnPropertyNames(aqiSourceData)[pageState.nowSelectCity]];
switch(pageState.nowGraTime)
{

    case "day":
        var dayNum=0;
        for(var day in city_data)
        {
            chartData[dayNum]=city_data[day];
            dayNum++;
        }
        break;
    case "week":
        var week=0,weekday,days=0,total=0;
        for(var day in city_data)
        {
            weekday=new Date(day).getDay();
            total+=city_data[day];
            days++;
            if (weekday==0)
            {
                chartData[week]=Math.round(total/days);
                total=0;
                days=0;
                week++
            }
        }
        break;
    case "month":
        var month=0,days=0,total=0;
        for(var day in city_data)
        {
            total+=city_data[day];
            days++;
            var today =new Date(day);
            var tomorrow=new Date(day);
            tomorrow.setDate(today.getDate()+1);
            if(today.getMonth()!=tomorrow.getMonth())
            {
                chartData[month]=Math.round(total/days);
                total=0;
                days=0;
                month++;
            }
        }
        break;
    default:
}
    renderChart();
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
}

init();