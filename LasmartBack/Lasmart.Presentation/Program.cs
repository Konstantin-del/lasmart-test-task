
using Lasmark.Persistence;
using Lasmark.Persistence.Entitys;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("Access-Control-Allow-Origin", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
builder.Services.AddScoped<ICircleRepository, CircleRepository>();

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.SerializerOptions.WriteIndented = true;
});


var app = builder.Build();
app.UseHttpsRedirection();
app.UseCors("Access-Control-Allow-Origin");


app.MapGet("circle", async (ICircleRepository circleRepository) =>
    await circleRepository.GetCirclesAsync());

app.MapPost("circle", async (CircleEntity circle, ICircleRepository circleRepository) =>
    await circleRepository.CreateCircleAsync(circle));

app.MapPost("circle/comment", async (CommentEntity comment, ICircleRepository circleRepository) =>
    await circleRepository.AddCommentAsync(comment));

app.MapDelete("circle/{id}", async (int id, ICircleRepository circleRepository) => 
    await circleRepository.DeleteCercleAsync(id));

app.Run();

