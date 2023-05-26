import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToggle,
    IonToolbar,
} from "@ionic/react";

import { useForm } from "react-hook-form";
import { ProductQuery } from "../../../../types/product";
import {
    Brand,
    Category,
    Line,
    SubCategory,
} from "../../../../types/categories";
import { close } from "ionicons/icons";

interface Props {
    setQuery: (query: ProductQuery) => void;
    onClose: () => void;
    query: ProductQuery;
    categories: Array<Category>;
    subCategories: Array<SubCategory>;
    lines: Array<Line>;
    brands: Array<Brand>;
}

const FiltersModal: React.FC<Props> = ({
    onClose,
    setQuery,
    query,
    categories,
    subCategories,
    brands,
    lines,
}) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        getValues,
        reset,
    } = useForm({
        defaultValues: query,
    });

    const onSubmit = (data: ProductQuery) => {
        console.log(data, "data");
        console.log(errors, "errors");
        setQuery(data);
        onClose();
    };

    const onReset = () => {
        setQuery({
            brand: 0,
            category: 0,
            isOnPromotion: false,
            line: 0,
            maxPrice: 0,
            minPrice: 0,
            search: "",
            subCategory: 0,
        });
        reset();
    };

    return (
        <>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonButton onClick={onClose}>
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton></IonButton>
                    </IonButtons>
                    <IonTitle style={{ textAlign: "center" }}>
                        <strong>Filtros</strong>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <IonList style={{ marginBottom: "1rem" }}>
                        <IonItem
                            style={{ marginBottom: "1rem", padding: "0" }}
                            className={
                                errors.minPrice && "ion-invalid"
                            }
                        >
                            <IonLabel>
                                <strong>Precio Mínimo:</strong>
                            </IonLabel>
                            <IonInput
                                {...register("minPrice", {
                                    required: false,
                                    valueAsNumber: true,
                                    validate: {
                                        positive: (v) => v >= 0,
                                        lessThan: (v) => {
                                            if (
                                                getValues("maxPrice") !== 0 &&
                                                v > 0
                                            ) {
                                                return (
                                                    v < getValues("maxPrice")
                                                );
                                            }
                                        },
                                    },
                                })}
                                type="number"
                            />
                            <IonNote slot="error">
                                {errors.minPrice?.type === "lessThan" &&
                                    "El precio mínimo debe ser menor al máximo"}
                            </IonNote>
                        </IonItem>
                        <IonItem
                            style={{ marginBottom: "1rem", padding: "0" }}
                            className={errors.minPrice && "ion-invalid"
                            }
                        >
                            <IonLabel>
                                <strong>Precio Máximo:</strong>
                            </IonLabel>
                            <IonInput
                                {...register("maxPrice", {
                                    required: false,
                                    valueAsNumber: true,
                                    validate: {
                                        positive: (v) => v >= 0,
                                        greaterThan: (v) => {
                                            if (
                                                getValues("minPrice") !== 0 &&
                                                v > 0
                                            ) {
                                                return (
                                                    v > getValues("minPrice")
                                                );
                                            }
                                        },
                                    },
                                })}
                                type="number"
                            />
                            <IonNote slot="error">
                                {errors.maxPrice?.type === "greaterThan" &&
                                    "El precio máximo debe ser mayor al mínimo"}
                            </IonNote>
                        </IonItem>
                        <IonItem style={{ marginBottom: "1rem", padding: "0" }}>
                            <IonLabel>
                                <strong>Categoría:</strong>
                            </IonLabel>
                            <IonSelect
                                {...register("category", {
                                    required: false,
                                })}
                            >
                                {categories.map((category) => (
                                    <IonSelectOption
                                        key={category.idProductFamily}
                                        value={category.idProductFamily}
                                    >
                                        {category.name}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                        <IonItem style={{ marginBottom: "1rem", padding: "0" }}>
                            <IonLabel>
                                <strong>Sub Categoría:</strong>
                            </IonLabel>
                            <IonSelect
                                {...register("subCategory", {
                                    required: false,
                                })}
                            >
                                {subCategories.map((sub) => (
                                    <IonSelectOption
                                        key={sub.idProductSubFamily}
                                        value={sub.idProductSubFamily}
                                    >
                                        {sub.nameSubFamily}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                        <IonItem style={{ marginBottom: "1rem", padding: "0" }}>
                            <IonLabel>
                                <strong>Linea:</strong>
                            </IonLabel>
                            <IonSelect
                                {...register("line", {
                                    required: false,
                                })}
                            >
                                {lines.map((line) => (
                                    <IonSelectOption
                                        key={line.idLine}
                                        value={line.idLine}
                                    >
                                        {line.name}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                        <IonItem style={{ marginBottom: "1rem", padding: "0" }}>
                            <IonLabel>
                                <strong>Marca:</strong>
                            </IonLabel>
                            <IonSelect
                                {...register("brand", {
                                    required: false,
                                })}
                            >
                                {brands.map((brand) => (
                                    <IonSelectOption
                                        key={brand.idBrand}
                                        value={brand.idBrand}
                                    >
                                        {brand.name}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <strong>Promoción:</strong>
                            </IonLabel>
                            <IonToggle
                                checked={getValues("isOnPromotion")}
                                {...register("isOnPromotion", {
                                    required: false,
                                })}
                            />
                        </IonItem>
                    </IonList>
                    <div style={{ display: "flex" }}>
                        <IonButton
                            expand="block"
                            onClick={onReset}
                            color="danger"
                        >
                            Limpiar
                        </IonButton>
                        <IonButton expand="block" type="submit" color="success">
                            Buscar
                        </IonButton>
                    </div>
                </form>
            </IonContent>
        </>
    );
};

export default FiltersModal;
