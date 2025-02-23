import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Redirect')
export class Redirect extends Component {
    redirectToPlatformSpecificUrl() {
        let targetUrl = '';
            
        if (sys.os === sys.OS.ANDROID) {
            targetUrl = 'https://play.google.com/store/apps/details?id=com.LuB.DeliveryConstruct&hl=en';
        } else if (sys.os === sys.OS.IOS) {
            targetUrl = 'https://apps.apple.com/us/app/ride-master-car-builder-game/id6449224139';
        } else if (sys.os === sys.OS.WINDOWS) {
            targetUrl = 'http://google.com/';
        }
    
        if (targetUrl) {
            window.location.href = targetUrl;
        } else {
            console.log('Платформа не поддерживается для редиректа');
        }
    }
}


