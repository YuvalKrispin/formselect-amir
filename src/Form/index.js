import React from "react";
import { useForm } from "react-hook-form";
import { mainData } from '../Data/mainData'
import { set } from 'lodash';

const RenderBox = ({ indexMain, register, toggleCheckbox, state, contain }) =>
    !contain ? null : contain.map((data, id) => (
        <section key={`${id} ${data.checkboxID}`}>
            <DisplayCheckbox {...{ indexMain, register, toggleCheckbox, checked: state[indexMain].contain[id].isActive, data, id }} />
        </section>
    ))

const DisplayCheckbox = ({ toggleCheckbox, register, data, indexMain, checked, id }) => {
    return (
        <div>
            <input ref={register()} name={data.checkboxID} type="checkbox" checked={checked} onChange={() => toggleCheckbox(indexMain, id)} />
            <label>{data.text}</label>
        </div>
    )
}

const FinishedForm = ({ register, state }) => {
    let reducer = () => state.reduce((acc, v) => {
        if (!v.contain) return acc;
        const checked = v.contain.filter(v => v.isActive);
        return [...acc, checked];
    }, []);
    const [original, setOriginal] = React.useState(reducer);
    const toggleCheckbox = (index, id) => setOriginal(set([...original], [index, id, 'isActive'], !original[index][id].isActive))
    return (
        <div>
            <input type="text" ref={register()} name="full-name" />
            <input type="date" ref={register()} name="date" />
            <input type="email" ref={register()} name="email" />
            <input type="text" ref={register()} name="phone" />
            <textarea name="additionalInfo" ref={register()} />
            <div>
                {original.map((v, indexMain) => v.map((data, id) => <DisplayCheckbox key={`${data.checkboxID} ${indexMain} ${id}`} {...{ data, register, checked: original[indexMain][id].isActive, indexMain, id, toggleCheckbox }} />))}
            </div>
            <input type="submit" />
        </div>)
}

const CheckboxMap = ({ state, toggleCheckbox, register }) =>
    state.map((checkbox, indexMain) =>
        checkbox.disable ? null : <RenderBox key={`${indexMain} ${checkbox.name}`} contain={checkbox.contain} {...{ indexMain, register, toggleCheckbox, state }} />
    )

const App = () => {
    const { handleSubmit, register } = useForm();
    const [data, setData] = React.useState(null);
    const [state, setState] = React.useState([...mainData]);
    const toggleTab = (index) => state.map((v, i) => setState(set([...state], [i, 'disable'], i !== index)));
    const toggleCheckbox = (index, id) => setState(set([...state], [index, 'contain', id, 'isActive'], !state[index].contain[id].isActive))
    const hendleSub = (submitData) => {
        let subData = { ...submitData }
        for (const p in subData) if (subData[p][0] === "on") subData[p] = true;
        setData(subData);
    }
    console.log(data);

    return (
        <div>
            {state.map((data, k) => <button key={`${k}  ${data.name}`} onClick={() => toggleTab(k)}>{data.name}</button>)}
            <form onSubmit={handleSubmit(submitData => hendleSub(submitData))}>
                {state[state.length - 1].disable ?
                    <CheckboxMap {...{ state, toggleCheckbox, register }} /> :
                    <FinishedForm {...{ register, handleSubmit, setData, state, toggleCheckbox }} />
                }
            </form >
        </div>
    );
}

export default App;