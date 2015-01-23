## Summary

* [网站](http://www.rawgit.com/altitudelabs/imaibo-public/master/index.html)
* [T3网站](http://t3-www.imaibo.net/index.php?app=moodindex&mod=Feelings&act=chart)

## 上传步骤

1. 上载/deploy/chart.html至themes/Maibo/apps/moodindex/feelings/chart.html
2. 上载/assets至themes/Maibo/common_v2/moodindex/assets
3. 上载/js至themes/Maibo/common_v2/moodindex/js
4. 上载/css至themes/Maibo/common_v2/moodindex/css
5. 上载/bower_components至bower_components

## Deployment Steps

1. Connect to VPN
2. Connect to FTP
3. Manually update chart.html, bearing in mind the change in path for JS and CSS files [TODO: Any way to make this more efficient]
4. Update template in deploy/chart.html to public/themes/Maibo/apps/moodindex/Feelings/chart.html
5. Update JS files in public/themes/Maibo/common_v2
6. Update bower components in public/bower_components
