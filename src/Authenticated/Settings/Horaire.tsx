import { Week } from "../../Types/week.js"
import "./horaire.css"

export const Horaire = ({ week }: { week: Week }) => {
  console.log("week : ", week)
  return (
    <div className="hours">
      <div className="day">
        <p>Lundi : </p>
        <p className="hour">
          {week?.monday_start} / {week?.monday_end}
        </p>
        <p>Mardi :</p>
        <p className="hour">
          {week?.thursday_start} / {week?.thursday_end}
        </p>
        <p>Mercredi :</p>
        <p className="hour">
          {week?.wednesday_start} / {week?.wednesday_end}
        </p>
        <p>Jeudi :</p>
        <p className="hour">
          {week?.tuesday_start} / {week?.tuesday_end}
        </p>
        <p>Vendredi :</p>
        <p className="hour">
          {week?.friday_start} / {week?.friday_end}
        </p>
        <p>Samedi :</p>
        <p className="hour">
          {week?.saturday_start} / {week?.saturday_end}
        </p>
        <p>Dimanche :</p>
        <p className="hour">
          {week?.sunday_start} / {week?.sunday_end}
        </p>
      </div>
    </div>
  )
}
