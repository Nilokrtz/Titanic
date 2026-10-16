    import { ApiPropertyOptional } from '@nestjs/swagger';                                
    import { Type } from 'class-transformer';                                             
    import { IsInt, IsOptional, IsString, Min } from 'class-validator';                   
                                                                                          
    export class FindInventarioQueryDto {                                                 
      @ApiPropertyOptional({ example: 1, default: 1 })                                    
      @IsOptional()                                                                       
      @Type(() => Number)                                                                 
      @IsInt()                                                                            
      @Min(1)                                                                             
      page?: number = 1;                                                                  
                                                                                          
      @ApiPropertyOptional({ example: 10, default: 10 })                                  
      @IsOptional()                                                                       
      @Type(() => Number)                                                                 
      @IsInt()                                                                            
      @Min(1)                                                                             
      limit?: number = 10;                                                                
                                                                                          
      @ApiPropertyOptional({ example: 'CURA_VIDA' })                                      
      @IsOptional()                                                                       
      @IsString()                                                                         
      tipo_efeito?: string;                                                               
                                                                                          
      @ApiPropertyOptional({ example: 1 })                                                
      @IsOptional()                                                                       
      @Type(() => Number)                                                                 
      @IsInt()                                                                            
      @Min(1)                                                                             
      quantidade_minima?: number;                                                         
    }