import { Gallery, StudentForm, Header, UserOutlined } from '@planingo/ditto';
import { useState } from 'react';
import { Layout } from '../Layout/Layout.js';
import { useAddOneCalendar, useCountCalendar, useSearchCalendars } from '../../Tools/Authenticated/calendars.js';

export const Calendars = () => {
    const { search, calendars, loading: loadingCalendars } = useSearchCalendars()
	const [addOneCalendar, loading] = useAddOneCalendar()
    const [isGrid, setIsGrid] = useState(false)
    const { count } = useCountCalendar()
    return <Layout>
        <Header
            placeholder="Rechercher"
            onSearch={search}
            isRefinementList={true}
            refinementList={{
                FirstActionIcon: UserOutlined,
                firstActionText: 'app.add.calendar',
                FirstForm: <StudentForm onSubmit={addOneCalendar} />,
                firstActioning: loading,
                onFirstAction: addOneCalendar,
                isGrid: isGrid,
                setIsGrid: () => setIsGrid(!isGrid),
                formId: "calendar-form",
            }}
        />
        {isGrid ?
            <Gallery
                datas={calendars}
                name="calendars"
                loading={loadingCalendars}
                count={count}
            />
        : <></>
        }
    </Layout>
}