import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ConfiguracionUtil } from "src/app/util/configuracionUtil";
import { CriterioBusquedaProducto } from "../entidades/criterioBusquedaProducto";


@Injectable( { providedIn : 'root' })
export class ProductosService {

    public constructor(private httpClient:HttpClient){
    }

    public listarProductos(criterio:CriterioBusquedaProducto):Observable<any>{
        console.log(JSON.stringify(criterio))
        return this.httpClient.get(ConfiguracionUtil.urlServidor+`/productos?criterio=${JSON.stringify(criterio)}`)
    }

}