import mobileGlobal from './mobile/global';
import mobileDesktop from './mobile/desktop';
import mobileDock from './mobile/dock';
import pcGlobal from './pc/global';
import pcDesktop from './pc/desktop';
import pcDock from './pc/dock';

export const apps = {
    pc: {
        global: pcGlobal,
        desktop: pcDesktop,
        dock: pcDock,
    },
    mobile: {
        global: mobileGlobal,
        desktop: mobileDesktop,
        dock: mobileDock,
    },
}
