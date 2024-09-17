using iSmart.Entity.Models;
using iSmart.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;

//using iSmart.Service;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using iSmart.Entity.Models;
using iSmart.Service;
using System.Net.WebSockets;
using iSmart.API.Controllers;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Text.Json;

internal class Program
{
    private static void Main(string[] args)

    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddMemoryCache();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = null;
                options.JsonSerializerOptions.WriteIndented = true;
            });
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateLifetime = true,
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

        builder.Services.AddSwaggerGen(option =>
        {
            option.SwaggerDoc("v1", new OpenApiInfo { Title = "iSmart API", Version = "v1" });
            option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter a valid token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "Bearer"
            });
            option.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {

                            Type=ReferenceType.SecurityScheme,
                            Id="Bearer"
                        }
                    },
                    new string[]{}
                }
            });
            // Remove WebSocket actions from Swagger document generation
            option.DocInclusionPredicate((docName, apiDesc) =>
            {
                // Exclude WebSocket actions from Swagger
                if (apiDesc.TryGetMethodInfo(out var methodInfo))
                {
                    if (methodInfo.DeclaringType == typeof(WebSocketController))
                    {
                        return false;
                    }
                }
                return true;
            });
    });

        builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        });

        var openAiApiKey = builder.Configuration["OpenAI:ApiKey"];
        
        
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", builder =>
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader());
        });


        /*builder.Services.AddAutoMapper(typeof(Program).Assembly);*/


        builder.Services.AddDbContext<iSmartContext>(options =>
                    options.UseSqlServer(builder.Configuration.GetConnectionString("SqlConnection")));
        builder.Services.AddScoped<ICategoryService, CategoryService>();
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IStatusService, StatusService>();
        builder.Services.AddScoped<ISupplierService, SupplierService>();
        builder.Services.AddScoped<IDeliveryService, DeliveryService>();
        builder.Services.AddScoped<IGoodsService, GoodsService>();
        builder.Services.AddScoped<IWarehouseService, WarehouseService>();
        builder.Services.AddScoped<IUserWarehouseService, UserWarehouseService>();
        builder.Services.AddScoped<IImportOrderService, ImportOrderService>();
        builder.Services.AddScoped<IImportOrderDetailService, ImportOrderDetailService>();
        builder.Services.AddScoped<IExportOrderService, ExportOrderService>();
        builder.Services.AddScoped<IExportOrderDetailService, ExportOrderDetailService>();
        builder.Services.AddScoped<ICustomerService, CustomerService>();
        builder.Services.AddScoped<IReportService, ReportService>();
        builder.Services.AddScoped<IReturnOrderService, ReturnOrderService>();
        builder.Services.AddScoped<IReturnOrderDetailService, ReturnOrderDetailService>();
        builder.Services.AddScoped<IInventoryCheckService, InventoryCheckService>();
        builder.Services.AddSingleton<WebSocketService>();
        builder.Services.AddSingleton(new OpenAIService(openAiApiKey));

        // Đăng ký các dịch vụ
        // builder.Services.AddScoped<ICategoryService, CategoryService>();
        // builder.Services.AddScoped<ISupplierService, SupplierService>();
        // builder.Services.AddScoped<IUserService, UserService>();
        // builder.Services.AddScoped<IStatusService, StatusService>();         
        // builder.Services.AddScoped<IProjectService, ProjectService>();
        // builder.Services.AddScoped<IStocktakeNoteService, StocktakeNoteService>();
        // builder.Services.AddScoped<IStocktakeNoteDetailService, StocktakeNoteDetailService>();


        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(option => option.RoutePrefix = string.Empty);

            app.UseSwaggerUI(option => option.SwaggerEndpoint("/swagger/v1/swagger.json", "iSmartAPI v1"));

        }

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.UseStaticFiles();

        app.UseCors("AllowAll");
        app.UseWebSockets();

        var webSocketOptions = new WebSocketOptions
        {
            KeepAliveInterval = TimeSpan.FromMinutes(2)
        };
        webSocketOptions.AllowedOrigins.Add("https://client.com");
        webSocketOptions.AllowedOrigins.Add("https://www.client.com");

        app.UseWebSockets(webSocketOptions);
        app.Run();

    }
}