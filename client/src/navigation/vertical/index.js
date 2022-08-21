import {
    Mail,
    Home,
    FileText,
    Plus,
    Users,
    UserPlus,
    Archive,
    Truck,
    Box,
    DollarSign, Percent, Grid, Activity, CheckSquare, Columns, Settings, LifeBuoy
} from 'react-feather'

export default [

    {
        header: 'Dashboard'
    },
    {
        id: 'home',
        title: 'Home',
        icon: <Home size={20}/>,
        badge: 'light-warning',
        navLink: '/home'

    },
    {
        id: 'analytics',
        title: 'Analytics',
        icon: <Activity size={20}/>,
        badge: 'light-warning'
    },
    {
        header: 'Apps'
    },
    {
        id : 'todo',
        title: 'ToDo',
        icon: <CheckSquare size={20}/>
    },
    {
        id : 'kanban',
        title: 'Kanaban',
        icon: <Columns size={20}/>
    },
    {
        header: 'Tools'
    },
    {
        id: 'invoices',
        title: 'Invoice',
        icon: <FileText size={20}/>,
        badge: 'light-warning',
        children: [
            {
                id: 'addInvoice',
                title: 'Add invoice',
                icon: <Plus size={20}/>
            },
            {
                id: 'manageInvoice',
                title: 'Manage invoices',
                icon: <Archive size={20}/>
            }
        ]

    },
    {
        id: 'clients',
        title: 'Client',
        icon: <Users size={20}/>,
        badge: 'light-warning',
        children: [
            {
                id: 'addClient',
                title: 'Add client',
                icon: <UserPlus size={20}/>
            },
            {
                id: 'manageClients',
                title: 'Manage clients',
                icon: <Archive size={20}/>,
                navLink : '/client'
            }
        ]

    },
    {
        id: 'commodity',
        title: 'Commodity ',
        icon: <Box size={20}/>,
        badge: 'light-warning',
        children: [
            {
                id: 'products',
                title: 'Product',
                icon: <Truck size={20}/>,
                children: [
                    {
                        id: 'addProduct',
                        title: 'Add product',
                        icon: <Plus size={20}/>,
                        badge: 'light-warning'
                    },
                    {
                        id: 'manageProduct',
                        title: 'Manage product',
                        icon: <Archive size={20}/>,
                        badge: 'light-warning'
                    }
                ]
            },
            {
                id: 'services',
                title: 'Service',
                icon: <DollarSign size={20}/>,
                children: [
                    {
                        id: 'addService',
                        title: 'Add Service',
                        icon: <Plus size={20}/>,
                        badge: 'light-warning'
                    },
                    {
                        id: 'manageServices',
                        title: 'Manage services',
                        icon: <Archive size={20}/>,
                        badge: 'light-warning'
                    }
                ]
            }


        ]

    },
    {
        id: 'taxes',
        title: 'Taxes',
        icon: <Percent size={20}/>,
        children: [
            {
                id: 'addTax',
                title: 'Add tax',
                icon: <Plus size={20}/>,
                badge: 'light-warning'
            },
            {
                id: 'manageTax',
                title: 'Manage tax',
                icon: <Archive size={20}/>,
                badge: 'light-warning'
            }
        ]
    },
    {
        header: 'MISC'
    },
    {
        id: 'settings',
        title: 'Setting',
        icon: <Settings size={20}/>
    },
    {
        id: 'faq',
        title: 'FAQ',
        icon: <LifeBuoy size={20}/>,
        navLink: '/faq'
    },
    {
        id: 'secondPage',
        title: 'Second Page',
        icon: <Mail size={20}/>,
        navLink: '/second-page'
    }
]
