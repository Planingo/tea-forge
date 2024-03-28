import { Gallery, GalleryList, Roles, CalendarOutlined } from '@planingo/ditto';
import { useState } from 'react';
import { useProfessors } from '../../Tools/Authenticated/professors.js';
import { Layout } from '../Layout/Layout.js';

export const Calendars = () => {
    const {professors, loading} = useProfessors()
    const [isGrid, setIsGrid] = useState(true)
    return <Layout
        loading={loading}
        navigation={{roles: [Roles.SUPER_ADMIN, Roles.PLANING_KEEPER]}}
        header={{
            isRefinementList: true,
            placeholder: 'Rechercher',
            refinementDetails: {
                FirstActionIcon: CalendarOutlined,
                FirstForm: <></>,
                SecondActionIcon: console.log,
                SecondForm: <></>,
                firstActionText: 'app.add.calendar',
                firstActioning: console.log,
                isGrid: isGrid,
                onFirstAction: console.log,
                onSecondAction: console.log,
                secondActionText: 'app.edit.calendar',
                secondActioning: console.log,
                setIsGrid: () => setIsGrid(isGrid)
            },
            refinementList: {
                FirstActionIcon: CalendarOutlined,
                firstActionText: 'app.add.calendar',
                FirstForm: <></>,
                firstActioning: console.log,
                onFirstAction: console.log,
                isGrid: isGrid,
                setIsGrid: () => setIsGrid(!isGrid)
            }
        }}
    >
        {isGrid ?
            <Gallery
                datas={professors}
                name="professor"
            />
        :
            <GalleryList
                columns={[
                    {
                        dataIndex: 'image',
                        // render: ({id}: {id: string}) => 
                        //     <img
                        //     src={`https://avatars.bugsyaya.dev/150/${id}`}
                        //     alt="placeholder"
                        //     />,
                        title: 'Photo'
                    },
                    {
                    dataIndex: 'name',
                    title: 'Name'
                    }
                ]}
                datas={professors}
                name="professor" />
            }
    </Layout>
}