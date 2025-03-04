import * as mobileDesktop from './mobile/desktop';
import * as mobileDock from './mobile/dock';
import * as pcGlobal from './pc/global';
import * as pcDesktop from './pc/desktop';
import * as pcDock from './pc/dock';

//const loadImport = async (url: string) => {
//    const mod = await import(`./${url}.ts`);
//    console.log(mod, mod.apps);
//    return mod.apps;
//}

export const apps = {
    pc: {
        global: pcGlobal.apps,
        desktop: pcDesktop.apps,
        dock: pcDock.apps,
    },
    mobile: {
        global: [],
        desktop: mobileDesktop.apps,
        dock: mobileDock.apps,
    },
}
