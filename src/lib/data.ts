export interface Apps {
    name: string, 
    app_name?: string, 
    src: string, 
    usable?: boolean,
    action?: () => void,
    redirect_link?: string,
    safari_link?: string,
    path?: string[],
};
export interface TBText {
    name: string,
    app_name?: string,
    text: string[]
}

export const desktopApps: Apps[] = [
    { name: 'Projects', app_name:'Finder', src: '/src/lib/assets/images/icon/Folder.png', path: ['louisgabillet', 'Projects'] },
    { name: 'About Me', app_name: 'Notes', src: '/src/lib/assets/images/icon/Notes.png' },
    { name: 'Mail', app_name: 'Mail', src: '/src/lib/assets/images/icon/Mail.png' },
];
export const dockApps: Apps[]  = [
    { name: 'Finder', src: '/src/lib/assets/images/icon/Finder.png' },
    { name: 'Launchpad', src: '/src/lib/assets/images/icon/Launchpad.png' },
    { name: 'Notes', src: '/src/lib/assets/images/icon/Notes.png' },
    { name: 'Mail', src: '/src/lib/assets/images/icon/Mail.png' },
    //{ name: 'Messages', src: '/src/lib/assets/images/icon/Messages.png' },
    //{ name: 'Photos', src: '/src/lib/assets/images/icon/Photos.png' },
    { name: 'Contact', src: '/src/lib/assets/images/icon/Contact.png' },
    { name: 'Safari', src: '/src/lib/assets/images/icon/Safari.png' },
    { name: 'Music', src: '/src/lib/assets/images/icon/Music.png' },
    { name: 'System Settings', app_name: 'System_Settings', src: '/src/lib/assets/images/icon/System_Settings.png' },
    { name: 'Projects', app_name: 'Finder', src: '/src/lib/assets/images/icon/Folder.png',  path: ['louisgabillet', 'Projects'] },
    { name: 'Bin', app_name: 'Finder', src: '/src/lib/assets/images/icon/Trash_Empty.png', path: ['Bin'] },
];
export const launchpadApps: Apps[]  = [
    { name: 'Finder', src: '/src/lib/assets/images/icon/Finder.png' },
    { name: 'Notes', src: '/src/lib/assets/images/icon/Notes.png' },
    { name: 'Mail', src: '/src/lib/assets/images/icon/Mail.png', redirect_link: 'mailto:gabillet.louis@gmail.com' },
    { name: 'Contact', src: '/src/lib/assets/images/icon/Contact.png' },
    { name: 'Safari', src: '/src/lib/assets/images/icon/Safari.png', redirect_link: 'https://www.google.com/' },
    { name: 'System Settings', app_name: 'System_Settings', src: '/src/lib/assets/images/icon/System_Settings.png' },
];
export const topBarText: TBText[] = [
    { name: 'Finder', text: ['File', 'Edit', 'View', 'Go', 'Window', 'Help'] },
    { name: 'Notes', text: ['File', 'Edit', 'Format', 'View', 'Window', 'Help'] },
    { name: 'Mail', text: ['File', 'Edit', 'View', 'Mailbox', 'Message', 'Format', 'Window', 'Help'] },
    { name: 'Safari', text: ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Window', 'Help'] },
    { name: 'System Settings', app_name: 'System_Settings', text: ['Files', 'Edit', 'View', 'Window', 'Help'] },
    { name: 'Music', text: ['File', 'Edit', 'Song', 'View', 'Controls', 'Account', 'Help'] },
    { name: 'Contact', text: ['File', 'Edit', 'View', 'Card', 'Window', 'Help'] },
]
