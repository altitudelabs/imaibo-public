window.onload = function() {
    window.dima = baron({
        root: '#news-view',
        scroller: '.scroller',
        bar: '.scroller__bar',
        barOnCls: 'baron'
    });

    window.dima = baron({
        root: '#experts-view',
        scroller: '.scroller',
        bar: '.scroller__bar',
        barOnCls: 'baron'
    });

    window.dima = baron({
        root: '#stockpicker-view',
        scroller: '.scroller',
        bar: '.scroller__bar',
        barOnCls: 'baron'
    });

    window.dima = baron({
        root: '.outer',
        scroller: '#outer-scroller',
        bar: '#outer-scroller__bar',
        barOnCls: 'baron'
    });
};