import React, { useContext } from "react";
import { FormEditorContext } from "webiny-app-forms/admin/components/FormEditor";
import { getPlugins } from "webiny-plugins";
import styled from "react-emotion";
import { Icon } from "webiny-ui/Icon";
import { Elevation } from "webiny-ui/Elevation";
import { Accordion, AccordionItem } from "webiny-ui/Accordion";
import { ReactComponent as HandleIcon } from "./icons/round-drag_indicator-24px.svg";
import Draggable from "./Draggable";

const FieldContainer = styled("div")({
    height: 25,
    padding: 5,
    marginBottom: 10
});

const FieldLabel = styled("div")({
    float: "left",
    textTransform: "uppercase"
});

const FieldHandle = styled("div")({
    float: "right",
    cursor: "grab"
});

function useFields() {
    const { formState, isFieldIdInUse } = useContext(FormEditorContext);

    function getGroups() {
        const fieldPlugins = getPlugins("cms-form-field-type")
            .filter(pl => !pl.fieldType.dataType)
            .filter(pl => !isFieldIdInUse(pl.fieldType.id));

        return getPlugins("cms-form-field-group").map(pl => ({
            ...pl.group,
            name: pl.name,
            fields: fieldPlugins.filter(f => f.fieldType.group === pl.name).map(pl => pl.fieldType)
        }));
    }

    return { getGroups, formState };
}

const Field = ({ fieldType: { id, label } }) => {
    return (
        <Draggable beginDrag={{ ui: "field", type: id }}>
            {({ connectDragSource }) => (
                <Elevation z={5}>
                    <FieldContainer>
                        <FieldLabel>{label}</FieldLabel>
                        <FieldHandle>
                            {connectDragSource(
                                <div>
                                    <Icon icon={<HandleIcon />} />
                                </div>
                            )}
                        </FieldHandle>
                    </FieldContainer>
                </Elevation>
            )}
        </Draggable>
    );
};

export const Fields = () => {
    const { getGroups, formState } = useFields();
    return (
        <React.Fragment>
            <Field fieldType={{ id: "custom", label: "Custom field" }} />

            <Accordion>
                {getGroups().map(group => (
                    <AccordionItem key={group.name} title={group.title} icon={null}>
                        {!group.fields.length && (
                            <span>No fields are available at the moment!</span>
                        )}
                        {group.fields.map(fieldType => (
                            <Field key={fieldType.id} fieldType={fieldType} />
                        ))}
                    </AccordionItem>
                ))}
            </Accordion>

            <pre style={{ marginTop: 100 }}>{JSON.stringify(formState, null, 2)}</pre>
        </React.Fragment>
    );
};