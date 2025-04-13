/* eslint-disable react/prop-types */
import { Star } from "lucide-react";
import { LiaTimesCircle } from "react-icons/lia";

const TodoItem = ({ todo }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    //   onChange={() => toggleEmailSelection(email.id)}
                    className="mr-5 bg-inherit text-[#D5D5D5] h-5 w-5"
                />
                <p className="text-[#2E2E2E]">{todo.content}</p>
            </div>
            <div className="flex items-center">
                {todo.isStarred ? (
                    <Star
                        className="mr-5 cursor-pointer text-yellow-400 fill-yellow-400 h-5 w-5"
                        // onClick={() => toggleStar(email.id)}
                        size={20}
                    />
                ) : (
                    <Star
                        className="mr-5 cursor-pointer text-[#B3B3B3]"
                        // onClick={() => toggleStar(email.id)}
                        size={20}
                    />
                )}
                <LiaTimesCircle className="text-[#888888] text-[20px]"/>
            </div>
        </div>
    )
}

export default TodoItem