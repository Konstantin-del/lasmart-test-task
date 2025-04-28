
using Lasmark.Persistence.Entitys;
using Microsoft.EntityFrameworkCore;

namespace Lasmark.Persistence;

public class Context : DbContext
{
    public DbSet<CircleEntity> Circles { get; set; }
    public DbSet<CommentEntity> Comments { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseInMemoryDatabase("TestDb");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CommentEntity>()
           .HasOne(c => c.Circles)
           .WithMany(w => w.Comments)
           .HasForeignKey(h => h.CircleId);
    }
}
