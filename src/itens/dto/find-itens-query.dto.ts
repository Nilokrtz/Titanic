import { Type } from 'class-transformer'; 
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindItensQueryDto { 
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)                          
    page?: number = 1; 

    @IsOptional()                                 
    @Type(() => Number)
    @IsInt()  
    @Min(1)
    limit?: number = 10;  
                                                    
    @IsOptional()                           
    @IsString()                          
    tipo_efeito?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()  
    @Min(0)
    preco_maximo?: number;

}