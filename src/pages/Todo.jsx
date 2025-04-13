import PagesTitle from "../components/PagesTitle";
import TodoItem from "../components/items/TodoItem";
import Card from "../ui/Card";

const todoData = [
  {
    content: 'Meeting with CEO',
    isStarred: false
  },
  {
    content: 'Pick up kids from school',
    isStarred: true
  },
  {
    content: 'Shopping with Brother',
    isStarred: false
  },
  {
    content: 'Review with HR',
    isStarred: false
  },
  {
    content: 'Going to Dia\’s School',
    isStarred: true
  },
  {
    content: 'Update File',
    isStarred: false
  },

]

const Todo = () => {
  return (
    <>
      <PagesTitle />

      <div className="mt-5">
        {todoData.map((todo, index) => (
          <Card classNames={'px-4 py-5 sm:p-6'} key={index} style={{ backgroundColor: '#ffffff', marginBottom: '20px' }}>
            <TodoItem todo={todo}/>
          </Card>
        ))}
      </div>
    </>
  )
}

export default Todo